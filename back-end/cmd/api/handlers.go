package main

import (
	"back-end/models"
	"fmt"
	"net/http"
	"regexp"
	"strconv"
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

	userID, err := getID(r.URL.Path, `\d+$`)
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

	groupID, err := getID(r.URL.Path, `\d+$`)
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

	groupID, err := getID(r.URL.Path, `\d+`)
	if err != nil {
		app.errorJSON(w, fmt.Errorf("group not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":

		groupEvents, err := app.DB.GetGroupEvents(groupID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting group events from database"), http.StatusNotFound)
			return
		}
		_ = app.writeJSON(w, http.StatusOK, groupEvents)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

// Event page
func (app *application) GroupEvent(w http.ResponseWriter, r *http.Request) {

	eventID, err := getID(r.URL.Path, `\d+$`)
	if err != nil {
		app.errorJSON(w, fmt.Errorf("invalid event id"), http.StatusNotFound)
		return
	}

	groupID, err := strconv.Atoi(regexp.MustCompile(`/groups/(\d+)/events/\d+`).FindStringSubmatch(r.URL.Path)[1])
	if err != nil {
		app.errorJSON(w, fmt.Errorf("invalid group id"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":

		event, err := app.DB.GetEventByID(eventID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting event from database"), http.StatusNotFound)
			return
		}

		if event.GroupID != groupID {
			app.errorJSON(w, fmt.Errorf("event does not belong to this group"), http.StatusNotFound)
			return
		}

		_ = app.writeJSON(w, http.StatusOK, event)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

// Event page
func (app *application) Register(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/register" {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "POST":
		var rd models.RegisterData

		err := app.readJSON(w, r, &rd)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		//TODO: Pilt tuleb salvesada kausta ja andmebaasi selle pildi nimi hashina. Hetkel salvestab kogu pildi andmebaasi (tekstina)

		err = app.validateRegisterData(&rd)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		err = app.DB.Register(&rd)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		resp := JSONResponse{
			Error:   false,
			Message: "User registered successfully",
		}

		app.writeJSON(w, http.StatusAccepted, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}
