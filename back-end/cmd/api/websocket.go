package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"back-end/models"

	"github.com/gorilla/websocket"
)

// TODO: add these to application struct so they're not global
var (
	channels         = make(map[*websocket.Conn]chan interface{})
	onlineUsers      = make(map[int][]*websocket.Conn)
	groupOnlineUsers = make(map[int][]*websocket.Conn)
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Replace the domain and port with your React.js application's domain and port
		return r.Header.Get("Origin") == "http://localhost:3000" || r.Header.Get("Origin") == "http://localhost:3001"
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
	channels[conn] = ch

	defer delete(channels, conn)

	// ip := conn.RemoteAddr().String()
	//	fmt.Println(len(channels), "connections =>", ip, "joined") // for testing purposes

	//	defer fmt.Println("onlineusers:", onlineUsers, "groupOnlineUsers", groupOnlineUsers) // for testing purposes
	//	defer fmt.Println(len(channels), "connections =>", ip, "left")                       // for testing purposes

	payload := struct {
		Cookie  string `json:"cookie"`
		ToID    int    `json:"to_id"`
		Content string `json:"content"`
		GroupID int    `json:"group_id"`
	}{}

	// Start a goroutine to write data from the channel to the connection
	go func() {
		for {
			data := <-ch

			err = conn.WriteJSON(data)
			if err != nil {
				return
			}
		}
	}()

	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			return
		}

		err = json.Unmarshal(p, &payload)
		if err != nil {
			log.Println("error: could not unmarshal payload", err)
			return
		}

		if payload.Cookie == "" {
			return
		}
		cookie := strings.Split(payload.Cookie, " ")[1]

		userID, err := app.DB.ValidateUUID(cookie)
		if err != nil {
			_ = conn.WriteJSON(err)
			return
		}

		if payload.GroupID == -1 {
			// Users chat
			addConnection(userID, conn)
			updateFriends(app)

			defer updateFriends(app)
			defer removeConnection(conn)
			// fmt.Println("onlineusers:", onlineUsers, "groupOnlineUsers", groupOnlineUsers) // for testing purposes

			if payload.Content != "" {
				err = app.DB.AddMessage(userID, payload.ToID, payload.Content)
				if err != nil {
					_ = conn.WriteJSON(err)
					return
				}
			}

			dataToMsn := struct {
				Messages []models.Message `json:"messages"`
				Friends  []models.Friend  `json:"friends"`
			}{}

			dataToMsn.Messages, err = app.DB.GetAllMessages(userID)
			if err != nil {
				_ = conn.WriteJSON(err)
				return
			}
			sendToUser(userID, dataToMsn)

			if payload.ToID != 0 {
				dataToMsn = struct {
					Messages []models.Message `json:"messages"`
					Friends  []models.Friend  `json:"friends"`
				}{}
				dataToMsn.Messages, err = app.DB.GetAllMessages(payload.ToID)
				if err != nil {
					_ = conn.WriteJSON(err)
					return
				}
				sendToUser(payload.ToID, dataToMsn)
			}
		} else if payload.GroupID == -2 {
			// Messenger chat
			addConnection(userID, conn)
			updateFriends(app)

			defer updateFriends(app)
			defer removeConnection(conn)

			//	fmt.Println("onlineusers:", onlineUsers, "groupOnlineUsers", groupOnlineUsers) // for testing purposes

			if payload.Content != "" {
				err = app.DB.AddMessage(userID, payload.ToID, payload.Content)
				if err != nil {
					_ = conn.WriteJSON(err)
					return
				}
			}

			dataToMsn := struct {
				Messages []models.Message `json:"messages"`
				Friends  []models.Friend  `json:"friends"`
			}{}

			dataToMsn.Messages, err = app.DB.GetAllMessages(userID)
			if err != nil {
				_ = conn.WriteJSON(err)
				return
			}
			dataToMsn.Friends, err = app.DB.GetFriendsList(userID)
			if err != nil {
				_ = conn.WriteJSON(err)
				return
			}

			checkFriendOnline(&dataToMsn.Friends)
			// fmt.Println(dataToMsn.Friends)

			// for _, v := range dataToMsn.Friends {
			// 	fmt.Println("userid:", v.Friend.UserID, v.Friend.FirstName, v.Friend.LastName, "isonline", v.IsOnline) // for testing purposes
			// }

			sendToUser(userID, dataToMsn)

			if payload.ToID != 0 {
				dataToMsn = struct {
					Messages []models.Message `json:"messages"`
					Friends  []models.Friend  `json:"friends"`
				}{}
				dataToMsn.Messages, err = app.DB.GetAllMessages(payload.ToID)
				if err != nil {
					_ = conn.WriteJSON(err)
					return
				}
				sendToUser(payload.ToID, dataToMsn)
			}
		} else if payload.GroupID > 0 {
			// Group chat
			addGroupConnection(payload.GroupID, conn)
			defer removeGroupConnection(conn)
			// fmt.Println("onlineusers:", onlineUsers, "groupOnlineUsers", groupOnlineUsers) // for testing purposes

			if payload.Content != "" {
				err = app.DB.GroupAddMessage(userID, payload.GroupID, payload.Content)
				if err != nil {
					_ = conn.WriteJSON(err)
					return
				}
			}

			data, err := app.DB.GroupGetAllMessages(payload.GroupID)
			if err != nil {
				_ = conn.WriteJSON(err)
				return
			}

			sendToGroup(payload.GroupID, data)
		} else {
			_ = conn.WriteJSON("error: something went wrong")
			return
		}
	}

	/////////////
}

func updateFriends(app *application) {
	var err error
	dataToMsn := struct {
		Messages []models.Message `json:"messages"`
		Friends  []models.Friend  `json:"friends"`
	}{}

	for userID := range onlineUsers {
		dataToMsn.Friends, err = app.DB.GetFriendsList(userID)
		if err != nil {
			log.Println(err)
			return
		}

		checkFriendOnline(&dataToMsn.Friends)

		sendToUser(userID, dataToMsn)
	}
}

// send data to all active group sockets
func sendToGroup(groupID int, data []models.Message) {
	groupConnections := groupOnlineUsers[groupID]
	for _, conn := range groupConnections {
		channels[conn] <- data
	}
}

// send data to all active user sockets
func sendToUser(userID int, data interface{}) {
	userConnections := onlineUsers[userID]
	for _, conn := range userConnections {
		channels[conn] <- data
	}
}

// remove user websocket connection from onlineUsers
func removeConnection(conn *websocket.Conn) {
	for userID, connections := range onlineUsers {
		for i, c := range connections {
			if c == conn {
				// Found matching connection, remove it
				onlineUsers[userID] = append(connections[:i], connections[i+1:]...)
				if len(onlineUsers[userID]) == 0 {
					delete(onlineUsers, userID)
					delete(channels, conn)
				}
				return
			}
		}
	}
}

// add user websocket connection to onlineUsers
func addConnection(userID int, conn *websocket.Conn) {
	// Check if the slice of connections for this user already contains the connection
	for _, existingConn := range onlineUsers[userID] {
		if existingConn == conn {
			// Connection already exists, return without adding it again
			return
		}
	}
	// Connection doesn't exist, add it to the slice
	onlineUsers[userID] = append(onlineUsers[userID], conn)
}

// remove user websocket connection from groupOnlineUsers
func removeGroupConnection(conn *websocket.Conn) {
	for groupID, connections := range groupOnlineUsers {
		for i, c := range connections {
			if c == conn {
				// Found matching connection, remove it
				groupOnlineUsers[groupID] = append(connections[:i], connections[i+1:]...)
				if len(groupOnlineUsers[groupID]) == 0 {
					delete(groupOnlineUsers, groupID)
					delete(channels, conn)
				}
				return
			}
		}
	}
}

// add user websocket connection to groupOnlineUsers
func addGroupConnection(groupID int, conn *websocket.Conn) {
	// Check if the slice of connections for this user already contains the connection
	for _, existingConn := range groupOnlineUsers[groupID] {
		if existingConn == conn {
			// Connection already exists, return without adding it again
			return
		}
	}
	// Connection doesn't exist, add it to the slice
	groupOnlineUsers[groupID] = append(groupOnlineUsers[groupID], conn)
}

// Check if friend is online
func checkFriendOnline(friends *[]models.Friend) {
	if len(*friends) == 0 {
		return
	}
	for i := range *friends {
		if _, ok := onlineUsers[(*friends)[i].Friend.UserID]; ok {
			(*friends)[i].IsOnline = true
		} else {
			(*friends)[i].IsOnline = false
		}
	}
}
