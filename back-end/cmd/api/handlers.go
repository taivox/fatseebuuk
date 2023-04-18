package main

import (
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"time"

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
	fmt.Println("SEEONPATH", r.URL.Path)
	fmt.Println("Tuli user handlerisse")
	userID, err := getID(r.URL.Path, `\d+$`)
	fmt.Println(userID)
	if err != nil {
		app.errorJSON(w, fmt.Errorf("user not found: invalid id"), http.StatusNotFound)
		return
	}

	fmt.Println("Tuli user handlerisse")

	switch r.Method {
	case "GET":
		user, err := app.DB.GetUserByID(userID)
		fmt.Println(user)
		if err != nil {
			fmt.Println(err)
			app.errorJSON(w, fmt.Errorf("error getting user from database"), http.StatusNotFound)
			return
		}
		currentUserID := r.Context().Value("user_id").(int)
		fmt.Println("userid on", userID, "currentuserID on ", currentUserID)
		if userID != currentUserID {
			user.FriendStatus, err = app.DB.ValidateFriendStatus(currentUserID, userID)
			fmt.Println(user.FriendStatus)
			if err != nil {
				app.errorJSON(w, fmt.Errorf("error getting friend status from database"), http.StatusNotFound)
				return
			}
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

// Validate if user is logged in
// func (app *application) ValidateLogin(w http.ResponseWriter, r *http.Request) {
// 	if r.URL.Path != "/validate-login" {
// 		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
// 		return
// 	}

// 	switch r.Method {
// 	case "GET":
// 		_, err := app.GetTokenFromHeaderAndVerify(w, r)
// 		if err != nil {
// 			app.errorJSON(w, err)
// 			return
// 		}
// 		resp := JSONResponse{
// 			Error: false,
// 		}
// 		app.writeJSON(w, http.StatusAccepted, resp)

// 	default:
// 		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
// 	}
// }

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
		notificationAmount, err := strconv.Atoi(r.URL.Query().Get("notificationsAmount"))
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting notificationsAmount from url"), http.StatusNotFound)
			return
		}
		UserID := r.Context().Value("user_id").(int)

		notifications, err := app.DB.GetUserNotifications(UserID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting notifications from database"), http.StatusNotFound)
			return
		}

		// long polling 30 sec with 0.5 sec ticker
		if len(notifications) == notificationAmount {
			ticker := time.NewTicker(500 * time.Millisecond)
			defer ticker.Stop()
			timeout := time.After(20 * time.Second)
			for {
				select {
				case <-ticker.C:
					notifications, err = app.DB.GetUserNotifications(UserID)
					if err != nil {
						app.errorJSON(w, fmt.Errorf("error getting notifications from database"), http.StatusNotFound)
						return
					}
					if len(notifications) != notificationAmount {
						app.writeJSON(w, http.StatusAccepted, notifications)
						return
					}
				case <-timeout:
					app.writeJSON(w, http.StatusAccepted, notifications)
					return
				}
			}
		} else {
			app.writeJSON(w, http.StatusAccepted, notifications)
			return
		}

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
		userID := r.Context().Value("user_id").(int)
		errNotOwner := app.DB.ValidateGroupOwnership(userID, groupID)
		if errNotOwner != nil {
			app.errorJSON(w, fmt.Errorf("unauthorized, not the group owner"), http.StatusNotFound)
			return
		}

		groupRequests, err := app.DB.GetGroupRequests(groupID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting group requests from database"), http.StatusNotFound)
			return
		}
		app.writeJSON(w, http.StatusAccepted, groupRequests)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) LeaveGroup(w http.ResponseWriter, r *http.Request) {
	groupID, err := strconv.Atoi(regexp.MustCompile(`/groups/(\d+)/leave$`).FindStringSubmatch(r.URL.Path)[1])
	if err != nil {
		app.errorJSON(w, fmt.Errorf("invalid group id"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":
		userID := r.Context().Value("user_id").(int)

		err := app.DB.RemoveGroupMembership(groupID, userID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error removing membership from database"), http.StatusNotFound)
			return
		}
		resp := JSONResponse{
			Error:   false,
			Message: "User left group successfully",
		}
		app.writeJSON(w, http.StatusAccepted, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) ApproveGroupRequest(w http.ResponseWriter, r *http.Request) {
	requestID, err := getID(r.URL.Path, `\d+$`)
	if err != nil {
		app.errorJSON(w, fmt.Errorf("invalid request id"), http.StatusNotFound)
		return
	}

	groupID, err := strconv.Atoi(regexp.MustCompile(`/groups/(\d+)/approverequest/\d+`).FindStringSubmatch(r.URL.Path)[1])
	if err != nil {
		app.errorJSON(w, fmt.Errorf("invalid group id"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":
		userID := r.Context().Value("user_id").(int)
		errNotOwner := app.DB.ValidateGroupOwnership(userID, groupID)
		if errNotOwner != nil {
			app.errorJSON(w, fmt.Errorf("unauthorized, not the group owner"), http.StatusNotFound)
			return
		}

		err := app.DB.ApproveGroupRequest(requestID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error approving request from database"), http.StatusNotFound)
			return
		}
		resp := JSONResponse{
			Error:   false,
			Message: "Member successfully added",
		}
		app.writeJSON(w, http.StatusAccepted, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) RejectGroupRequest(w http.ResponseWriter, r *http.Request) {
	requestID, err := getID(r.URL.Path, `\d+$`)
	if err != nil {
		app.errorJSON(w, fmt.Errorf("invalid request id"), http.StatusNotFound)
		return
	}

	groupID, err := strconv.Atoi(regexp.MustCompile(`/groups/(\d+)/rejectrequest/\d+`).FindStringSubmatch(r.URL.Path)[1])
	if err != nil {
		app.errorJSON(w, fmt.Errorf("invalid group id"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":
		userID := r.Context().Value("user_id").(int)
		errNotOwner := app.DB.ValidateGroupOwnership(userID, groupID)
		if errNotOwner != nil {
			app.errorJSON(w, fmt.Errorf("unauthorized, not the group owner"), http.StatusNotFound)
			return
		}

		err := app.DB.RemoveGroupRequest(requestID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error removing request from database"), http.StatusNotFound)
			return
		}
		resp := JSONResponse{
			Error:   false,
			Message: "Request successfully removed",
		}
		app.writeJSON(w, http.StatusAccepted, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) FriendsList(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/friends" {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "GET":
		userID := r.Context().Value("user_id").(int)
		friends, err := app.DB.GetFriendsList(userID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting friends list from database"), http.StatusNotFound)
			return
		}
		app.writeJSON(w, http.StatusAccepted, friends)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}
