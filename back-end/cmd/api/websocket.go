package main

import (
	"back-end/models"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Replace the domain and port with your React.js application's domain and port
		return r.Header.Get("Origin") == "http://localhost:3000"
	},
}

func (app *application) WebsocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("SIITVA")
		log.Println(err)
		return
	}
	defer conn.Close()

	// Create a new channel for this connection
	ch := make(chan interface{})
	models.Channels[conn] = ch

	ip := conn.RemoteAddr().String()
	fmt.Println(len(models.Channels), "connections =>", ip, "joined")

	payload := struct {
		ToID    int    `json:"to_id"`
		FromID  int    `json:"from_id"`
		Content string `json:"content"`
	}{}

	// Start a goroutine to write data from the channel to the connection
	go func() {
		for {
			data := <-ch

			err = conn.WriteJSON(data)
			if err != nil {
				delete(models.Channels, conn)
				SetUserOffline(conn)
				fmt.Println(len(models.Channels), "connections =>", ip, "left")
				return
			}
		}
	}()

	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			delete(models.Channels, conn)
			SetUserOffline(conn)
			fmt.Println(len(models.Channels), "connections =>", ip, "left")
			return
		}

		err = json.Unmarshal(p, &payload)
		if err != nil {
			log.Println("unmarshalides tuli mingi error:", err)
		}

		fmt.Println("JSON data go-s", payload)

		fmt.Println("onlineusers:", models.OnlineUsers)

	}
}
