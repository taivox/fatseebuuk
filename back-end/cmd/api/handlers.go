package main

import (
	"fmt"
	"net/http"
	"regexp"
	"strconv"

	"back-end/models"

	"github.com/gofrs/uuid"
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
	userID := r.Context().Value("user_id").(int)
	if err != nil {
		app.errorJSON(w, fmt.Errorf("group not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":

		errNotMember := app.DB.ValidateGroupMembership(userID, groupID)
		errNotOwner := app.DB.ValidateGroupOwnership(userID, groupID)

		var group *models.Group
		if errNotMember != nil && errNotOwner != nil {
			group, err = app.DB.GetGroupByIDForNonMember(groupID)
			group.UserIsGroupMember = false
			group.UserIsGroupOwner = false
		} else if errNotMember == nil {
			group, err = app.DB.GetGroupByID(groupID)
			group.UserIsGroupMember = true
		} else if errNotOwner == nil {
			group, err = app.DB.GetGroupByID(groupID)
			group.UserIsGroupOwner = true

		}

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

func (app *application) GroupJoin(w http.ResponseWriter, r *http.Request) {
	groupID, err := strconv.Atoi(regexp.MustCompile(`/groups/(\d+)/join$`).FindStringSubmatch(r.URL.Path)[1])
	if err != nil {
		app.errorJSON(w, fmt.Errorf("invalid group id"), http.StatusNotFound)
		return
	}

	userID := r.Context().Value("user_id").(int)

	switch r.Method {
	case "POST":

		err := app.DB.AddUserToGroup(userID, groupID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error joining group"), http.StatusNotFound)
			return
		}

		resp := JSONResponse{
			Error:   false,
			Message: "User requested join successfully",
		}

		_ = app.writeJSON(w, http.StatusOK, resp)

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

		var imageName string
		if rd.ProfileImage != "" {
			imageName, err = saveImageToFile(rd.ProfileImage, "profile")
			if err != nil {
				app.errorJSON(w, err)
				return
			}
			rd.ProfileImage = imageName
		} else {
			rd.ProfileImage = "default_profile_picture.png"
		}

		err = app.validateRegisterData(&rd)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		rd.Password, err = hashPassword(rd.Password)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		err = app.DB.Register(&rd)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		go sendEmail(&rd)

		resp := JSONResponse{
			Error:   false,
			Message: "User registered successfully",
		}

		app.writeJSON(w, http.StatusAccepted, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) Login(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/login" {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "POST":
		var ld models.LoginData
		err := app.readJSON(w, r, &ld)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		err = app.validateLoginData(&ld)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		uuid := uuid.Must(uuid.NewV4()).String()
		resp := JSONResponse{
			Error:   false,
			Message: "User logged in successfully",
			Data:    uuid,
		}

		userID, err := app.DB.GetUserIDByEmail(ld.Email)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
		resp.UserID = userID
		err = app.DB.AddSession(userID, uuid)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		app.writeJSON(w, http.StatusAccepted, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) Logout(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/logout" {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "POST":

		cookie := app.GetTokenFromHeader(w, r)

		app.DB.RemoveSession(cookie)

		resp := JSONResponse{
			Error:   false,
			Message: "User logged out successfully",
		}

		app.writeJSON(w, http.StatusAccepted, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) Feed(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/feed" {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":

		UserID := r.Context().Value("user_id").(int)

		feed, err := app.DB.GetUserFeed(UserID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting feed from database"), http.StatusNotFound)
			return
		}

		app.writeJSON(w, http.StatusAccepted, feed)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) Notifications(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/notifications" {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":

		UserID := r.Context().Value("user_id").(int)

		notifications, err := app.DB.GetUserNotifications(UserID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting notifications from database"), http.StatusNotFound)
			return
		}
		// fmt.Println(notifications)
		app.writeJSON(w, http.StatusAccepted, notifications)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) GroupRequests(w http.ResponseWriter, r *http.Request) {
	groupID, err := strconv.Atoi(regexp.MustCompile(`/groups/(\d+)/requests$`).FindStringSubmatch(r.URL.Path)[1])
	if err != nil {
		app.errorJSON(w, fmt.Errorf("invalid group id"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":
		// UserID := r.Context().Value("user_id").(int)

		groupRequests, err := app.DB.GetGroupRequests(groupID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting group requests from database"), http.StatusNotFound)
			return
		}
		fmt.Println(groupRequests)
		app.writeJSON(w, http.StatusAccepted, groupRequests)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}
