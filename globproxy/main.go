package main

import (
	"log"
	"net/http"
	"regexp"
	"strings"

	"github.com/gorilla/websocket"
)

var (
	secretRegexp = regexp.MustCompile("$[a-zA-Z0-9]{32}^")

	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

func main() {
	controller := make(map[string]*websocket.Conn)
	client := make(map[string]*websocket.Conn)

	registerHandler("controller", &controller, &client)
	registerHandler("client", &client, &controller)

	addr := ":3000"
	log.Printf("started websocket on %s\n", addr)
	log.Fatalln(http.ListenAndServe(addr, nil))
}

func registerHandler(pathName string, self *map[string]*websocket.Conn, other *map[string]*websocket.Conn) {
	path := "/" + pathName + "/"

	http.HandleFunc(path, func(w http.ResponseWriter, r *http.Request) {
		x := r.URL.Path[len(path):]
		if len(x) != 32 || secretRegexp.MatchString(x) {
			log.Printf("[%s] invalid secret format: %q\n", pathName, x)
			return
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		(*self)[x] = conn

		for {
			mt, buffer, err := conn.ReadMessage()
			if err != nil {
				errstr := err.Error()
				if strings.Contains(errstr, "An established connection was aborted") || strings.Contains(errstr, "going away") {
					delete(*self, x)
					return
				}
				log.Printf("[%s] %v\n", pathName, err)
				continue
			}

			c, ok := (*other)[x]
			if !ok {
				log.Printf("[%s] unable to find remote party for: %q\n", pathName, x)
				continue
			}

			err = c.WriteMessage(mt, buffer)
			if err != nil {
				log.Println(err)
			}
		}
	})
}
