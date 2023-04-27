package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"strings"
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

		currentUserID := r.Context().Value("user_id").(int)
		if userID != currentUserID {
			user.FriendStatus, err = app.DB.ValidateFriendStatus(currentUserID, userID)
			if err != nil {
				app.errorJSON(w, fmt.Errorf("error getting friend status from database"), http.StatusNotFound)
				return
			}
		}

		user.IsOwner = userID == currentUserID

		// Get user posts if user is friend, current user or profile is public
		if user.FriendStatus == 3 || userID == currentUserID || user.IsPublic {
			user.FriendsList, err = app.DB.GetFriendsList(userID)
			if err != nil {
				app.errorJSON(w, fmt.Errorf("error getting friends list from database"), http.StatusNotFound)
				return
			}
			user.Posts, err = app.DB.GetUserPosts(userID)
			if err != nil {
				app.errorJSON(w, fmt.Errorf("error getting user posts from database"), http.StatusNotFound)
				return
			}
		}

		_ = app.writeJSON(w, http.StatusOK, user)
	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) CurrentUser(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/currentuser" {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	userID := r.Context().Value("user_id").(int)

	switch r.Method {
	case "GET":
		currentUser, err := app.DB.GetUserByID(userID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting user from database"), http.StatusNotFound)
			return
		}
		_ = app.writeJSON(w, http.StatusOK, currentUser)
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
			if err != nil && err != sql.ErrNoRows {
				app.errorJSON(w, fmt.Errorf("error getting group from database"), http.StatusNotFound)
				return
			}
			group.UserIsGroupMember = false
			group.UserIsGroupOwner = false

			err = app.DB.ValidateGroupInviteStatus(userID, groupID)
			if err == nil {
				group.UserIsInvited = true
			} else {
				group.UserIsInvited = false
			}

			err = app.DB.ValidateGroupRequestStatus(userID, groupID)
			if err == nil {
				group.UserHasRequested = true
			} else {
				group.UserHasRequested = false
			}

		} else if errNotMember == nil {
			group, err = app.DB.GetGroupByID(groupID)
			group.UserIsGroupMember = true
		} else if errNotOwner == nil {
			group, err = app.DB.GetGroupByID(groupID)
			group.UserIsGroupOwner = true
		}

		if err != nil && err != sql.ErrNoRows {
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

		err = app.DB.ValidateEventAttendanceStatus(r.Context().Value("user_id").(int), eventID)
		if err == nil {
			event.CurrentUserGoing = true
		} else if err == sql.ErrNoRows {
			event.CurrentUserGoing = false
		} else {
			app.errorJSON(w, fmt.Errorf("error getting event attendance status"), http.StatusNotFound)
			return
		}

		event.GoingList, err = app.DB.GetEventGoing(eventID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting event going list"), http.StatusNotFound)
			return
		}
		event.NotGoingList, err = app.DB.GetEventNotGoing(eventID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting event not going list"), http.StatusNotFound)
			return
		}

		_ = app.writeJSON(w, http.StatusOK, event)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

// Event response handler
func (app *application) GroupRespondEvent(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case "PATCH":
		eventID, err := strconv.Atoi(regexp.MustCompile(`/groups/(\d+)/events/(\d+)/respondevent`).FindStringSubmatch(r.URL.Path)[2])
		if err != nil {
			app.errorJSON(w, fmt.Errorf("invalid event id"), http.StatusNotFound)
			return
		}

		userID := r.Context().Value("user_id").(int)

		payload := struct {
			ResponseType string `json:"response_type"`
		}{}

		err = app.readJSON(w, r, &payload)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		err = app.DB.AddEventResponse(userID, eventID, payload.ResponseType)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error adding response to database"), http.StatusNotFound)
			return
		}

		resp := JSONResponse{
			Error:   false,
			Message: fmt.Sprintf("Responded %s successfully", payload.ResponseType),
		}

		_ = app.writeJSON(w, http.StatusOK, resp)

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

func (app *application) GroupGetInviteList(w http.ResponseWriter, r *http.Request) {
	groupID, err := strconv.Atoi(regexp.MustCompile(`/groups/(\d+)/getinvitelist$`).FindStringSubmatch(r.URL.Path)[1])
	if err != nil {
		app.errorJSON(w, fmt.Errorf("invalid group id"), http.StatusNotFound)
		return
	}

	userID := r.Context().Value("user_id").(int)

	switch r.Method {
	case "GET":

		users, err := app.DB.GetGroupInviteList(userID, groupID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting group invite list from database"), http.StatusNotFound)
			return
		}

		_ = app.writeJSON(w, http.StatusOK, users)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) GroupCreateInvite(w http.ResponseWriter, r *http.Request) {
	groupID, err := strconv.Atoi(regexp.MustCompile(`/groups/(\d+)/createinvite$`).FindStringSubmatch(r.URL.Path)[1])
	if err != nil {
		app.errorJSON(w, fmt.Errorf("invalid group id"), http.StatusNotFound)
		return
	}

	userID := r.Context().Value("user_id").(int)

	switch r.Method {
	case "POST":

		err = app.DB.ValidateGroupMembership(userID, groupID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("user is not in group"), http.StatusNotFound)
			return
		}

		var friend models.User
		err := app.readJSON(w, r, &friend)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		err = app.DB.AddGroupInvite(userID, groupID, friend.UserID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error creating group invite"), http.StatusNotFound)
			return
		}

		resp := JSONResponse{
			Error:   false,
			Message: "User invited join successfully",
		}

		_ = app.writeJSON(w, http.StatusOK, resp)
	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) GroupAcceptInvite(w http.ResponseWriter, r *http.Request) {
	groupID, err := strconv.Atoi(regexp.MustCompile(`/groups/(\d+)/acceptinvite$`).FindStringSubmatch(r.URL.Path)[1])
	if err != nil {
		app.errorJSON(w, fmt.Errorf("invalid group id"), http.StatusNotFound)
		return
	}

	userID := r.Context().Value("user_id").(int)

	switch r.Method {
	case "POST":

		err = app.DB.ApproveGroupInvite(userID, groupID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error accepting group invite"), http.StatusNotFound)
			return
		}

		resp := JSONResponse{
			Error:   false,
			Message: "Joined group successfully",
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

// userID, k6ik userid
func (app *application) UsersSearch(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(int)

	switch r.Method {
	case "GET":
		var searchData models.SearchData
		var err error

		searchData.Users, err = app.DB.GetAllUsers()
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error getting users from database"), http.StatusNotFound)
			return
		}
		searchData.UserID = userID

		app.writeJSON(w, http.StatusAccepted, searchData)
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

// Handler for adding a friend
func (app *application) FriendAdd(w http.ResponseWriter, r *http.Request) {
	friendID, err := strconv.Atoi(regexp.MustCompile(`/friends/(\d+)/add$`).FindStringSubmatch(r.URL.Path)[1])
	if err != nil {
		app.errorJSON(w, fmt.Errorf("invalid friend id"), http.StatusNotFound)
		return
	}

	userID := r.Context().Value("user_id").(int)

	switch r.Method {
	case "POST":

		err := app.DB.AddFriend(userID, friendID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error adding user to friends"), http.StatusNotFound)
			return
		}

		resp := JSONResponse{
			Error:   false,
			Message: "Friend added successfully",
		}

		_ = app.writeJSON(w, http.StatusOK, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

// Handler for accepting friend request
func (app *application) FriendAccept(w http.ResponseWriter, r *http.Request) {
	friendID, err := strconv.Atoi(regexp.MustCompile(`/friends/(\d+)/accept$`).FindStringSubmatch(r.URL.Path)[1])
	if err != nil {
		app.errorJSON(w, fmt.Errorf("invalid friend id"), http.StatusNotFound)
		return
	}

	userID := r.Context().Value("user_id").(int)

	switch r.Method {
	case "POST":

		err := app.DB.ApproveFriendRequest(userID, friendID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error accepting friend request"), http.StatusNotFound)
			return
		}

		resp := JSONResponse{
			Error:   false,
			Message: "Friend request accepted successfully",
		}

		_ = app.writeJSON(w, http.StatusOK, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

// Handler for removing friend and declining friend request
func (app *application) FriendRemove(w http.ResponseWriter, r *http.Request) {
	friendID, err := strconv.Atoi(regexp.MustCompile(`/friends/(\d+)/remove$`).FindStringSubmatch(r.URL.Path)[1])
	if err != nil {
		app.errorJSON(w, fmt.Errorf("invalid user id"), http.StatusNotFound)
		return
	}

	userID := r.Context().Value("user_id").(int)

	switch r.Method {
	case "POST":

		err := app.DB.RemoveFriend(userID, friendID)
		if err != nil {
			app.errorJSON(w, fmt.Errorf("error removing user from friends"), http.StatusNotFound)
			return
		}

		resp := JSONResponse{
			Error:   false,
			Message: "Friend removed successfully",
		}

		_ = app.writeJSON(w, http.StatusOK, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) CreatePost(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/createpost" {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "POST":
		userID := r.Context().Value("user_id").(int)
		var post models.Post

		err := app.readJSON(w, r, &post)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		var imageName string
		if post.Image != "" {
			imageName, err = saveImageToFile(post.Image, "post")
			if err != nil {
				app.errorJSON(w, err)
				return
			}
			post.Image = imageName
		}

		err = app.DB.AddNewPost(&post, userID)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		resp := JSONResponse{
			Error:   false,
			Message: "Posted successfully",
		}

		app.writeJSON(w, http.StatusAccepted, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) CreateGroup(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		var group models.Group
		group.UserID = r.Context().Value("user_id").(int)
		err := app.readJSON(w, r, &group)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		if group.Image != "" {
			group.Image, err = saveImageToFile(group.Image, "group")
			if err != nil {
				app.errorJSON(w, err)
				return
			}
		} else {
			group.Image = "default_group_image.png"
		}

		err = app.DB.AddNewGroup(&group)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		resp := JSONResponse{
			Error:   false,
			Message: "Group created successfully",
		}
		app.writeJSON(w, http.StatusAccepted, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) CreateEvent(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		var event models.Event
		var err error
		event.Poster.UserID = r.Context().Value("user_id").(int)

		event.GroupID, err = strconv.Atoi(regexp.MustCompile(`/groups/(\d+)/createevent$`).FindStringSubmatch(r.URL.Path)[1])
		if err != nil {
			app.errorJSON(w, fmt.Errorf("invalid group id"), http.StatusNotFound)
			return
		}

		err = app.readJSON(w, r, &event)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		if event.Image != "" {
			event.Image, err = saveImageToFile(event.Image, "event")
			if err != nil {
				app.errorJSON(w, err)
				return
			}
		} else {
			event.Image = "default_event_image.png"
		}

		err = app.DB.AddNewEvent(&event)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		resp := JSONResponse{
			Error:   false,
			Message: "Event created successfully",
		}
		app.writeJSON(w, http.StatusAccepted, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) CreateGroupPost(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		userID := r.Context().Value("user_id").(int)
		groupID, err := strconv.Atoi(regexp.MustCompile(`/groups/(\d+)/createpost$`).FindStringSubmatch(r.URL.Path)[1])
		if err != nil {
			app.errorJSON(w, fmt.Errorf("invalid group id"), http.StatusNotFound)
			return
		}

		var post models.Post

		err = app.readJSON(w, r, &post)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		var imageName string
		if post.Image != "" {
			imageName, err = saveImageToFile(post.Image, "post")
			if err != nil {
				app.errorJSON(w, err)
				return
			}
			post.Image = imageName
		}

		err = app.DB.AddNewGroupPost(&post, userID, groupID)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		resp := JSONResponse{
			Error:   false,
			Message: "Posted successfully",
		}

		app.writeJSON(w, http.StatusAccepted, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) CreateComment(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/createcomment" {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "POST":
		payload := struct {
			PostID     int    `json:"post_id"`
			Content    string `json:"content"`
			CurrentURL string `json:"current_url"`
			UserID     int    `json:"user_id"`
		}{}

		err := app.readJSON(w, r, &payload)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
		payload.UserID = r.Context().Value("user_id").(int)

		if strings.Contains(payload.CurrentURL, "groups") {
			err = app.DB.AddNewGroupComment(payload.UserID, payload.PostID, payload.Content)
			if err != nil {
				app.errorJSON(w, err)
				return
			}
		} else {
			err = app.DB.AddNewComment(payload.UserID, payload.PostID, payload.Content)
			if err != nil {
				app.errorJSON(w, err)
				return
			}
		}

		resp := JSONResponse{
			Error:   false,
			Message: "Comment posted successfully",
		}

		app.writeJSON(w, http.StatusAccepted, resp)
	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) CreatePostLike(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/createpostlike" {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "POST":
		var like models.Like

		err := app.readJSON(w, r, &like)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		like.UserID = r.Context().Value("user_id").(int)

		err = app.DB.TogglePostLike(&like)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		resp := JSONResponse{
			Error:   false,
			Message: "Toggled like successfully",
		}

		app.writeJSON(w, http.StatusAccepted, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) CreateCommentLike(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/createcommentlike" {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "POST":
		var like models.Like

		like.UserID = r.Context().Value("user_id").(int)

		err := app.readJSON(w, r, &like)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		err = app.DB.ToggleCommentLike(&like)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		resp := JSONResponse{
			Error:   false,
			Message: "Liked successfully",
		}

		app.writeJSON(w, http.StatusAccepted, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}

func (app *application) AddCover(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/addcover" {
		app.errorJSON(w, fmt.Errorf("not found"), http.StatusNotFound)
		return
	}

	switch r.Method {
	case "PATCH":

		userID := r.Context().Value("user_id").(int)

		payload := struct {
			Image string `json:"image"`
		}{}

		err := app.readJSON(w, r, &payload)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		imageName, err := saveImageToFile(payload.Image, "cover")
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		err = app.DB.UpdateCoverImage(userID, imageName)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		resp := JSONResponse{
			Error:   false,
			Message: "Liked successfully",
		}

		app.writeJSON(w, http.StatusAccepted, resp)

	default:
		app.errorJSON(w, fmt.Errorf("method not suported"), http.StatusMethodNotAllowed)
	}
}
