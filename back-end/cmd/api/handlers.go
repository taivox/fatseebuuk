package main

import (
	"fmt"
	"net/http"
	"strconv"
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

// User
func (app *application) User(w http.ResponseWriter, r *http.Request) {
	if !strings.HasPrefix(r.URL.Path, "/user/") {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	id := strings.TrimPrefix(r.URL.Path, "/user/")
	userID, err := strconv.Atoi(id)
	if err != nil {
		app.errorJSON(w, fmt.Errorf("user not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":

		user, err := app.DB.GetUserByID(userID)
		if err != nil {
			fmt.Println(err)
			app.errorJSON(w, fmt.Errorf("error getting user from database"), http.StatusNotFound)
			return
		}
		_ = app.writeJSON(w, http.StatusOK, user)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}
