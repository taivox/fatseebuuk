package main

import (
	"net/http"
)

func (app *application) routes() http.Handler {
	// create a router mux
	mux := http.NewServeMux()

	// mux.HandleFunc("/ws", WebsocketHandler) //TODO: implement websocket handler for chat
	mux.HandleFunc("/", app.Home)
	mux.HandleFunc("/user/", app.User)

	// add middleware
	handler := app.enableCORS(mux)

	return handler
}
