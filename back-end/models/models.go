package models

import (
	"time"
)

type User struct {
	UserID       int       `json:"user_id"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Nickname     string    `json:"nickname"`
	DateOfBirth  time.Time `json:"date_of_birth"`
	ProfileImage string    `json:"profile_image"`
	CoverImage   string    `json:"cover_image"`
	About        string    `json:"about"`
	Email        string    `json:"email,omitempty"`
	Created      time.Time `json:"-"`
	IsPublic     bool      `json:"is_public"`
	IsOwner      bool      `json:"is_owner"`
	FriendStatus int       `json:"friend_status,omitempty"`
	FriendsList  []Friend  `json:"friends_list,omitempty"`
	Posts        []*Post   `json:"posts,omitempty"`
}

type Group struct {
	GroupID           int         `json:"group_id"`
	Title             string      `json:"title"`
	Description       string      `json:"description"`
	Created           time.Time   `json:"created"`
	UserID            int         `json:"user_id"`
	Image             string      `json:"image"`
	Posts             []GroupPost `json:"posts,omitempty"`
	UserIsGroupMember bool        `json:"user_is_group_member"`
	UserIsGroupOwner  bool        `json:"user_is_group_owner"`
	UserIsInvited     bool        `json:"user_is_invited"`
	UserHasRequested  bool        `json:"user_has_requested"`
	Members           []User      `json:"members,omitempty"`
}

type GroupPost struct {
	PostID   int            `json:"post_id"`
	Poster   User           `json:"poster"`
	GroupID  int            `json:"group_id"`
	Content  string         `json:"content"`
	Image    string         `json:"image"`
	Created  time.Time      `json:"created"`
	Comments []GroupComment `json:"comments,omitempty"`
	Likes    int            `json:"likes"`
}

type GroupComment struct {
	CommentID int       `json:"comment_id"`
	Poster    User      `json:"poster"`
	PostID    int       `json:"post_id"`
	Content   string    `json:"content"`
	Created   time.Time `json:"created"`
	Likes     int       `json:"likes"`
}

type Post struct {
	PostID          int       `json:"post_id"`
	Poster          User      `json:"poster"`
	Content         string    `json:"content"`
	Image           string    `json:"image"`
	Created         time.Time `json:"created"`
	Comments        []Comment `json:"comments"`
	Likes           int       `json:"likes"`
	IsAlmostPrivate bool      `json:"is_almost_private"`
	SelectedUsers   []int     `json:"selected_users"`
}

type Comment struct {
	CommentID int       `json:"comment_id"`
	Poster    User      `json:"poster"`
	PostID    int       `json:"post_id"`
	Content   string    `json:"content"`
	Created   time.Time `json:"created"`
	Likes     int       `json:"likes"`
}

type Event struct {
	EventID          int       `json:"event_id"`
	Poster           User      `json:"poster"`
	GroupID          int       `json:"group_id"`
	Title            string    `json:"title"`
	Description      string    `json:"description"`
	Image            string    `json:"image"`
	EventDate        time.Time `json:"event_date"`
	Created          time.Time `json:"created"`
	CurrentUserGoing bool      `json:"current_user_going"`
	GoingList        []User    `json:"going_list,omitempty"`
	NotGoingList     []User    `json:"not_going_list,omitempty"`
}

type Events struct {
	UpcomingEvents []Event `json:"upcoming_events"`
	PastEvents     []Event `json:"past_events"`
}

type Message struct {
	MessageID int       `json:"message_id"`
	FromID    int       `json:"from_id"`
	ToID      int       `json:"to_id,omitempty"`
	GroupID   int       `json:"group_id,omitempty"`
	Content   string    `json:"content"`
	Created   time.Time `json:"created"`
}

type RegisterData struct {
	FirstName       string `json:"first_name"`
	LastName        string `json:"last_name"`
	Nickname        string `json:"nickname"`
	DateOfBirth     string `json:"date_of_birth"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirm_password"`
	About           string `json:"about"`
	ProfileImage    string `json:"profile_image"`
}

type LoginData struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Notification type can be "group_invite", "group_request", "friend_request, "event_created"
type Notification struct {
	NotificationID int    `json:"notification_id"`
	ToID           int    `json:"to_id"`
	From           User   `json:"from"`
	Type           string `json:"type"`
	Boxicons_name  string `json:"boxicons_name"`
	CreatedAt      string `json:"created"`
	Link           string `json:"link"`
}

type GroupRequests struct {
	RequestID int  `json:"request_id"`
	Requester User `json:"requester"`
	GroupID   int  `json:"group_id"`
}

type Friend struct {
	Friend         User `json:"friend"`
	RequestPending bool `json:"request_pending"`
	IsOnline       bool `json:"is_online"`
}

type SearchData struct {
	UserID int    `json:"user_id"`
	Users  []User `json:"users"`
}

type Like struct {
	LikeID         int  `json:"like_id"`
	UserID         int  `json:"user_id"`
	PostID         int  `json:"post_id"`
	CommentID      int  `json:"comment_id"`
	BelongsToGroup bool `json:"belongs_to_group"`
}
