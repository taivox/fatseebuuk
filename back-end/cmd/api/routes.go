package main

import (
	"fmt"
	"net/http"
	"regexp"
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
		//Handler for events. Example: /groups/1/events/1
		if regexp.MustCompile(`/groups/\d+/events/\d+$`).MatchString(r.URL.Path) {
			app.GroupEvent(w, r)
			return
		}
		//Handler for events. Example: /groups/1/events
		if regexp.MustCompile(`/groups/\d+/events$`).MatchString(r.URL.Path) {
			app.GroupEvents(w, r)
			return
		}
		//Handler for group. Example: /groups/1
		if regexp.MustCompile(`/groups/\d+$`).MatchString(r.URL.Path) {
			app.Group(w, r)
			return
		}
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
	})

	// add middleware
	handler := app.enableCORS(mux)
	//TODO: implement authentication middleware

	return handler
}
