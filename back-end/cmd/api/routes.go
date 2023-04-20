package main

import (
	"fmt"
	"net/http"
	"regexp"
)

func (app *application) routes() http.Handler {
	// create a router mux
	mux := http.NewServeMux()

	// handlers for unauthenticated routes
	mux.HandleFunc("/register", app.Register)
	mux.HandleFunc("/login", app.Login)
	//	mux.HandleFunc("/validate-login", app.ValidateLogin)

	// handlers for authenticated routes
	mux.HandleFunc("/", app.Home)
	mux.HandleFunc("/logout", app.Logout)
	mux.HandleFunc("/user/", app.User)
	mux.HandleFunc("/groups", app.AllGroups)
	mux.HandleFunc("/feed", app.Feed)
	mux.HandleFunc("/notifications", app.Notifications)
	mux.HandleFunc("/friends", app.FriendsList)
	mux.HandleFunc("/userssearch", app.UsersSearch)
	mux.HandleFunc("/createpost", app.CreatePost)

	mux.HandleFunc("/friends/", func(w http.ResponseWriter, r *http.Request) {
		// Handler for adding friend. Example: /friends/1/add
		if regexp.MustCompile(`/friends/\d+/add$`).MatchString(r.URL.Path) {
			app.FriendAdd(w, r)
			return
		}
		// Handler for accepting friend request. Example: /friends/1/accept
		if regexp.MustCompile(`/friends/\d+/accept$`).MatchString(r.URL.Path) {
			app.FriendAccept(w, r)
			return
		}
		// Handler for removing friend. Example: /friends/1/remove
		if regexp.MustCompile(`/friends/\d+/remove$`).MatchString(r.URL.Path) {
			app.FriendRemove(w, r)
			return
		}
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
	})

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

		if regexp.MustCompile(`/groups/\d+/createpost$`).MatchString(r.URL.Path) {
			app.CreateGroupPost(w, r)
			return
		}

		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
	})

	// add middleware
	handler := app.Authorize(mux)
	handler = app.enableCORS(handler)

	return handler
}
