package main

import (
	"fmt"
	"net/http"
	"strings"
)

// Home displays the status of the api, as JSON.
func (app *application) Home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":
		payload := struct {
			Status  string `json:"status"`
			Message string `json:"message"`
			Version string `json:"version"`
		}{
			Status:  "active",
			Message: "Fatseebuuk up an runin",
			Version: "1.0.0",
		}

		_ = app.writeJSON(w, http.StatusOK, payload)
	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

// User page
func (app *application) User(w http.ResponseWriter, r *http.Request) {
	if !strings.HasPrefix(r.URL.Path, "/user/") {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	userID, err := getID(r.URL.Path, "/user/", "/")
	if err != nil {
		app.errorJSON(w, fmt.Errorf("user not found: invalid id"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":
		user, err := app.DB.GetUserByID(userID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting user from database"), http.StatusNotFound)
			return
		}
		_ = app.writeJSON(w, http.StatusOK, user)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

// All groups page
func (app *application) AllGroups(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/groups" {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":

		allGroups, err := app.DB.GetAllGroups()
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting group from database"), http.StatusNotFound)
			return
		}

		_ = app.writeJSON(w, http.StatusOK, allGroups)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

// Group page
func (app *application) Group(w http.ResponseWriter, r *http.Request) {
	if !strings.HasPrefix(r.URL.Path, "/groups/") {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	groupID, err := getID(r.URL.Path, "/groups/", "/")
	if err != nil {
		app.errorJSON(w, fmt.Errorf("group not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":

		group, err := app.DB.GetGroupByID(groupID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting group from database"), http.StatusNotFound)
			return
		}
		_ = app.writeJSON(w, http.StatusOK, group)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

// Events page
func (app *application) GroupEvents(w http.ResponseWriter, r *http.Request) {
	if !strings.HasPrefix(r.URL.Path, "/groups/") || !strings.HasSuffix(r.URL.Path, "/events") {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	groupID, err := getID(r.URL.Path, "/groups/", "/events")
	if err != nil {
		app.errorJSON(w, fmt.Errorf("group not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":

		groupEvents, err := app.DB.GetGroupEvents(groupID)
		if err != nil {
			fmt.Println(err)
			app.errorJSON(w, fmt.Errorf("error getting group events from database"), http.StatusNotFound)
			return
		}
		_ = app.writeJSON(w, http.StatusOK, groupEvents)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}
