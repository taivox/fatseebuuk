package models

import "time"

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
}

type Group struct {
	GroupID     string      `json:"group_id"`
	Title       string      `json:"title"`
	Description string      `json:"description"`
	Created     time.Time   `json:"created"`
	UserID      string      `json:"user_id"`
	Image       string      `json:"image"`
	Posts       []GroupPost `json:"posts,omitempty"`
}

type GroupPost struct {
	PostID   int            `json:"post_id"`
	Poster   User           `json:"poster"`
	GroupID  int            `json:"group_id"`
	Content  string         `json:"content"`
	Image    string         `json:"image"`
	Created  time.Time      `json:"created"`
	Comments []GroupComment `json:"comments"`
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
	PostID   int       `json:"post_id"`
	Poster   User      `json:"poster"`
	Content  string    `json:"content"`
	Image    string    `json:"image"`
	IsPublic bool      `json:"is_public"`
	Created  time.Time `json:"created"`
	Comments []Comment `json:"comments"`
	Likes    int       `json:"likes"`
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
	EventID     int       `json:"event_id"`
	Poster      User      `json:"poster"`
	GroupID     int       `json:"group_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Image       string    `json:"image"`
	EventDate   time.Time `json:"event_date"`
	Created     time.Time `json:"created"`
}

type Events struct {
	UpcomingEvents []Event `json:"upcoming_events"`
	PastEvents     []Event `json:"past_events"`
}

type Message struct {
	MessageID int       `json:"message_id"`
	FromUser  User      `json:"from_user"`
	ToUser    User      `json:"to_user"`
	Content   string    `json:"content"`
	IsSeen    bool      `json:"is_seen"`
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
