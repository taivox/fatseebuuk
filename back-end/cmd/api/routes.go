package main

import (
	"net/http"
	"strings"
)

func (app *application) routes() http.Handler {
	// create a router mux
	mux := http.NewServeMux()

	// mux.HandleFunc("/ws", WebsocketHandler) //TODO: implement websocket handler for chat

	//handlers for routes
	mux.HandleFunc("/", app.Home)
	mux.HandleFunc("/user/", app.User)
	mux.HandleFunc("/groups", app.AllGroups)

	mux.HandleFunc("/groups/", func(w http.ResponseWriter, r *http.Request) {
		//Handler for events. Example: /groups/1/events
		if strings.HasPrefix(r.URL.Path, "/groups/") && strings.HasSuffix(r.URL.Path, "/events") {
			app.GroupEvents(w, r)
			return
		}
		//Handler for group. Example: /groups/1
		app.Group(w, r)
	})

	// add middleware
	handler := app.enableCORS(mux)
	//TODO: implement authentication middleware

	return handler
}
