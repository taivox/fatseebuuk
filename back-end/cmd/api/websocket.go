package main

import (
	"back-end/models"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
)

var Channels = make(map[*websocket.Conn]chan interface{})

// map [userID] []usersWebsocketConnections
var OnlineUsers = make(map[int][]*websocket.Conn)

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
		log.Println(err)
		return
	}
	defer conn.Close()

	// Create a new channel for this connection
	ch := make(chan interface{})
	Channels[conn] = ch

	ip := conn.RemoteAddr().String()
	fmt.Println(len(Channels), "connections =>", ip, "joined")

	payload := struct {
		Cookie  string `json:"cookie"`
		ToID    int    `json:"to_id"`
		Content string `json:"content"`
	}{}

	// Start a goroutine to write data from the channel to the connection
	go func() {
		for {
			data := <-ch

			err = conn.WriteJSON(data)
			if err != nil {
				RemoveConnection(conn)
				fmt.Println(len(Channels), "connections =>", ip, "left")
				fmt.Println("onlineusers:", OnlineUsers)

				return
			}
		}
	}()

	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			RemoveConnection(conn)
			fmt.Println(len(Channels), "connections =>", ip, "left")
			fmt.Println("onlineusers:", OnlineUsers)
			return
		}

		err = json.Unmarshal(p, &payload)
		if err != nil {
			log.Println("unmarshalides tuli mingi error:", err)
		}

		cookie := strings.Split(payload.Cookie, " ")[1]

		userID, err := app.DB.ValidateUUID(cookie)
		if err != nil {
			_ = conn.WriteJSON(err)
			fmt.Println(len(Channels), "connections =>", ip, "left")
			return
		}

		addConnection(userID, conn)

		//kui payloadis content eksisteerib, siis lisame uue data andmebaasi
		if payload.Content != "" {
			err = app.DB.AddMessage(userID, payload.ToID, payload.Content)
			if err != nil {
				_ = conn.WriteJSON(err)
				return
			}
		}

		data, err := app.DB.GetAllMessages(userID)
		if err != nil {
			_ = conn.WriteJSON(err)
			return
		}
		SendToUser(userID, data)

		if payload.ToID != 0 {
			recieverData, err := app.DB.GetAllMessages(payload.ToID)
			if err != nil {
				_ = conn.WriteJSON(err)
				return
			}
			SendToUser(payload.ToID, recieverData)
		}

		fmt.Println("JSON data go-s", payload)

		fmt.Println("onlineusers:", OnlineUsers)

	}
}

// seda peame saatma saajale ja saatjale
func SendToUser(userID int, data []models.Message) {
	userConnections := OnlineUsers[userID]
	for _, conn := range userConnections {
		Channels[conn] <- data
	}
}

func RemoveConnection(conn *websocket.Conn) {
	for userID, connections := range OnlineUsers {
		for i, c := range connections {
			if c == conn {
				// Found matching connection, remove it
				OnlineUsers[userID] = append(connections[:i], connections[i+1:]...)
				if len(OnlineUsers[userID]) == 0 {
					delete(OnlineUsers, userID)
					delete(Channels, conn)
				}
				return
			}
		}
	}
}

func addConnection(userID int, conn *websocket.Conn) {
	// Check if the slice of connections for this user already contains the connection
	for _, existingConn := range OnlineUsers[userID] {
		if existingConn == conn {
			// Connection already exists, return without adding it again
			return
		}
	}
	// Connection doesn't exist, add it to the slice
	OnlineUsers[userID] = append(OnlineUsers[userID], conn)

}
