FROM golang:latest as builder

WORKDIR /opt/alarmy/globproxy

COPY ./main.go ./main.go

RUN go get github.com/gorilla/websocket &&\
    GOOS=linux GOARCH=amd64 go build -a -o globproxy &&\
    chown 777 ./globproxy

EXPOSE 8082

CMD ./globproxy "0.0.0.0:8082"