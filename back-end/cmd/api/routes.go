package main

import (
	"net/http"
)

func (app *application) routes() http.Handler {
	// create a router mux
	mux := http.NewServeMux()

	// mux.HandleFunc("/ws", WebsocketHandler) //TODO: implement websocket handler for chat

	//handlers for routes
	mux.HandleFunc("/", app.Home)
	mux.HandleFunc("/user/", app.User)
	mux.HandleFunc("/groups", app.AllGroups)
	mux.HandleFunc("/groups/", app.Group)

	// add middleware
	handler := app.enableCORS(mux)
	//TODO: implement authentication middleware

	return handler
}
