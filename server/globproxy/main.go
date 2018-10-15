package main

import (
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
	"sync"

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

	controllers     map[string]*websocket.Conn
	controllersLock sync.RWMutex
	clients         map[string][]*websocket.Conn
	clientsLock     sync.RWMutex
)

func main() {
	controllers = make(map[string]*websocket.Conn)
	clients = make(map[string][]*websocket.Conn)

	registerHandler("controller", controllerToClient)
	registerHandler("client", clientToController)

	addr := "0.0.0.0:8082"
	if len(os.Args) > 1 {
		addr = os.Args[1]
	}
	log.Printf("started websocket on %s\n", addr)
	log.Fatalln(http.ListenAndServe(addr, nil))
}

func registerHandler(pathName string, handler func(pathName string, c *websocket.Conn, secret string)) {
	path := "/" + pathName + "/"

	http.HandleFunc(path, func(w http.ResponseWriter, r *http.Request) {
		log.Printf("[%s] %q started connecting process\n", pathName, r.RemoteAddr)

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

		handler(pathName+"/"+x, conn, x)
	})
}

func controllerToClient(pathName string, conn *websocket.Conn, secret string) {
	controllersLock.Lock()
	controllers[secret] = conn
	controllersLock.Unlock()

	log.Printf("[%s] controller connected\n", pathName)

	for {
		mt, buffer, err := conn.ReadMessage()
		if err != nil {
			errstr := err.Error()
			if strings.Contains(errstr, "An established connection was aborted") || strings.Contains(errstr, "going away") || strings.Contains(errstr, "close 1005") {
				log.Printf("[%s] controller disconnected\n", pathName)

				controllersLock.Lock()
				defer controllersLock.Unlock()
				delete(controllers, secret)

				return
			}

			log.Printf("[%s] error during read from controller: %v. will continue\n", pathName, err)
			continue
		}

		log.Printf("[%s] has message for clients\n", pathName)

		clientsLock.RLock()
		c, ok := clients[secret]
		if !ok {
			log.Printf("[%s] unable to find clients\n", pathName)
			clientsLock.RUnlock()
			continue
		}

		for _, item := range c {
			err = item.WriteMessage(mt, buffer)
			if err != nil {
				log.Printf("[%s] error during write to client: %v\n", pathName, err)
			}
		}
		clientsLock.RUnlock()
	}
}

func clientToController(pathName string, conn *websocket.Conn, secret string) {
	id := pathName + "(" + conn.RemoteAddr().String() + ")"

	clientsLock.Lock()
	clients[secret] = append(clients[secret], conn)
	clientsLock.Unlock()

	log.Printf("[%s] connected\n", id)

	for {
		mt, buffer, err := conn.ReadMessage()
		if err != nil {
			errstr := err.Error()
			if strings.Contains(errstr, "An established connection was aborted") || strings.Contains(errstr, "going away") || strings.Contains(errstr, "close 1005") {
				log.Printf("[%s] disconnectd\n", id)

				// Connection to the client was closed therefore delete him from the
				// clients list and therefore prevent attempts of sending updates
				// from controllers to them
				clientsLock.Lock()
				defer clientsLock.Unlock()

				myClients := clients[secret]

				if len(myClients) == 1 {
					delete(clients, secret)
				} else {
					var delAt int
					for i, addr := range myClients {
						if addr == conn {
							delAt = i
							break
						}
					}
					myClients = append(myClients[:delAt], myClients[delAt+1:]...)
					clients[secret] = myClients
				}
				return
			}

			log.Printf("[%s] error during read from client: %v. will continue\n", id, err)
			continue
		}

		log.Printf("[%s] has message for controller\n", id)

		controllersLock.RLock()
		c, ok := controllers[secret]
		if !ok {
			log.Printf("[%s] unable to find controller\n", id)
			controllersLock.RUnlock()
			continue
		}

		err = c.WriteMessage(mt, buffer)
		if err != nil {
			log.Printf("[%s] error during write to controller: %v\n", id, err)
		}
		controllersLock.RUnlock()
	}
}
