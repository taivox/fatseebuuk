package main

import (
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func WebsocketHandler(w http.ResponseWriter, r *http.Request) {
	// conn, err := upgrader.Upgrade(w, r, nil)
	// if err != nil {
	// 	log.Println(err)
	// 	return
	// }
	// defer conn.Close()

	// // Create a new channel for this connection
	// ch := make(chan interface{})
	// structs.Channels[conn] = ch

	// ip := conn.RemoteAddr().String()
	// fmt.Println(len(structs.Channels), "connections =>", ip, "joined")

	// // Start a goroutine to write data from the channel to the connection
	// go func() {
	// 	for {
	// 		data := <-ch

	// 		err = conn.WriteJSON(data)
	// 		if err != nil {
	// 			delete(structs.Channels, conn)
	// 			helpers.SetUserOffline(conn)
	// 			helpers.DB.GetUsersFromDB()
	// 			fmt.Println(len(structs.Channels), "connections =>", ip, "left")
	// 			return
	// 		}
	// 	}
	// }()

	// for {
	// 	_, p, err := conn.ReadMessage()
	// 	if err != nil {
	// 		delete(structs.Channels, conn)
	// 		helpers.SetUserOffline(conn)
	// 		helpers.DB.GetUsersFromDB()
	// 		fmt.Println(len(structs.Channels), "connections =>", ip, "left")
	// 		return
	// 	}
	// 	//	fmt.Println("seeonp", string(p))

	// 	var JData structs.JsonData
	// 	err = json.Unmarshal(p, &JData)
	// 	helpers.ErrCheck(err)
	// 	fmt.Println("JSON data go-s", JData)

	// 	if helpers.DB.CheckCookie(&JData) {
	// 		if _, exists := structs.OnlineUsers[JData.UserID]; !exists {
	// 			structs.OnlineUsers[JData.UserID] = conn
	// 			helpers.DB.GetUsersFromDB()
	// 			helpers.DB.GetMessagesFromDB(conn, &JData)
	// 		}
	// 	}
	// 	fmt.Println("onlineusers:", structs.OnlineUsers)

	// 	JData.Address = strings.TrimPrefix(JData.Address, fmt.Sprintf("http://%s:%d", structs.IP, structs.PORT))
	// 	queryArr := strings.Split(JData.Address, "id=")
	// 	contentType := queryArr[0]

	// 	var id string
	// 	if len(queryArr) == 2 {
	// 		id = queryArr[1]
	// 	}

	// 	switch contentType {
	// 	case "/":
	// 		helpers.DB.GetBoard(conn, &JData)
	// 	case "/subforum?":
	// 		helpers.DB.GetSubforum(&id, conn, &JData)
	// 	case "/thread?":
	// 		helpers.DB.GetThread(&id, conn, &JData)
	// 	case "/user?", "/user":
	// 		helpers.DB.GetUser(&id, conn, &JData)
	// 	case "/login":
	// 		helpers.DB.Login(&w, conn, &JData)
	// 	case "/login?":
	// 		helpers.DB.Login(&w, conn, &JData)
	// 	case "/register":
	// 		helpers.DB.GetRegister(conn, &JData)
	// 	case "/register?":
	// 		helpers.DB.Register(&w, conn, &JData)
	// 	case "/logout":
	// 		helpers.SetUserOffline(conn)
	// 		helpers.DB.Logout(&w, conn, &JData)
	// 		helpers.DB.GetUsersFromDB()
	// 	case "/chat":
	// 		helpers.DB.SaveMessageToDB(conn, &JData)
	// 		helpers.DB.GetUsersFromDB()
	// 	case "/typing":
	// 		helpers.DB.SendTyping(conn, &JData)
	// 	default:
	// 		fmt.Println("default case", JData.Address)
	// 	}
	// }
}
