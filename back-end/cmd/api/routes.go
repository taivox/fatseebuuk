package main

import (
	"fmt"
	"net/http"
	"regexp"
)

// func (app *application) routes() http.Handler {
// 	// create a router mux
// 	mux := http.NewServeMux()

// 	// mux.HandleFunc("/ws", WebsocketHandler) //TODO: implement websocket handler for chat

// 	// handlers for routes
// 	mux.HandleFunc("/", app.Home)
// 	mux.HandleFunc("/user/", app.User)
// 	mux.HandleFunc("/groups", app.AllGroups)
// 	mux.HandleFunc("/register", app.Register)
// 	mux.HandleFunc("/login", app.Login)

// 	mux.HandleFunc("/groups/", func(w http.ResponseWriter, r *http.Request) {
// 		// Handler for events. Example: /groups/1/events/1
// 		if regexp.MustCompile(`/groups/\d+/events/\d+$`).MatchString(r.URL.Path) {
// 			app.GroupEvent(w, r)
// 			return
// 		}
// 		// Handler for events. Example: /groups/1/events
// 		if regexp.MustCompile(`/groups/\d+/events$`).MatchString(r.URL.Path) {
// 			app.GroupEvents(w, r)
// 			return
// 		}
// 		// Handler for group. Example: /groups/1
// 		if regexp.MustCompile(`/groups/\d+$`).MatchString(r.URL.Path) {
// 			app.Group(w, r)
// 			return
// 		}
// 		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
// 	})

// 	// add middleware
// 	handler := app.enableCORS(mux)
// 	// handler = app.Authorize(handler)
// 	// TODO: implement authentication middleware

// 	return handler
// }

func (app *application) routes() http.Handler {
	// create a router mux
	mux := http.NewServeMux()

	// handlers for routes
	mux.HandleFunc("/register", app.Register)
	mux.HandleFunc("/login", app.Login)

	mux.HandleFunc("/", app.Home)
	mux.HandleFunc("/logout", app.Logout)
	mux.HandleFunc("/user/", app.User)
	mux.HandleFunc("/groups", app.AllGroups)
	mux.HandleFunc("/feed", app.Feed)
	mux.HandleFunc("/notifications", app.Notifications)
	mux.HandleFunc("/friends", app.FriendsList)

	mux.HandleFunc("/groups/", func(w http.ResponseWriter, r *http.Request) {
		// Handler for events. Example: /groups/1/events/1
		if regexp.MustCompile(`/groups/\d+/events/\d+$`).MatchString(r.URL.Path) {
			app.GroupEvent(w, r)
			return
		}
		// Handler for events. Example: /groups/1/events
		if regexp.MustCompile(`/groups/\d+/events$`).MatchString(r.URL.Path) {
			app.GroupEvents(w, r)
			return
		}
		// Handler for group. Example: /groups/1
		if regexp.MustCompile(`/groups/\d+$`).MatchString(r.URL.Path) {
			app.Group(w, r)
			return
		}
		// Handler for joining group. Example: /groups/1/join
		if regexp.MustCompile(`/groups/\d+/join$`).MatchString(r.URL.Path) {
			app.GroupJoin(w, r)
			return
		}

		if regexp.MustCompile(`/groups/\d+/requests$`).MatchString(r.URL.Path) {
			app.GroupRequests(w, r)
			return
		}

		if regexp.MustCompile(`/groups/\d+/rejectrequest/\d+$`).MatchString(r.URL.Path) {
			app.RejectGroupRequest(w, r)
			return
		}

		if regexp.MustCompile(`/groups/\d+/approverequest/\d+$`).MatchString(r.URL.Path) {
			app.ApproveGroupRequest(w, r)
			return
		}

		if regexp.MustCompile(`/groups/\d+/leave$`).MatchString(r.URL.Path) {
			app.LeaveGroup(w, r)
			return
		}

		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
	})

	// add middleware
	handler := app.Authorize(mux)
	handler = app.enableCORS(handler)

	return handler
}
