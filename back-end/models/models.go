package models

import "time"

type User struct {
	UserID         int       `json:"user_id"`
	FirstName      string    `json:"first_name"`
	LastName       string    `json:"last_name"`
	Nickname       string    `json:"nickname"`
	DateOfBirth    time.Time `json:"date_of_birth"`
	ProfilePicture string    `json:"profile_picture"`
	CoverPicture   string    `json:"cover_picture"`
	About          string    `json:"about"`
	Email          string    `json:"email,omitempty"`
	Created        time.Time `json:"-"`
	IsPublic       bool      `json:"is_public"`
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
	UserID   int            `json:"user_id"`
	GroupID  int            `json:"group_id"`
	Content  string         `json:"content"`
	Image    string         `json:"image"`
	Created  time.Time      `json:"created"`
	Comments []GroupComment `json:"comments"`
}

type GroupComment struct {
	CommentID int       `json:"comment_id"`
	UserID    int       `json:"user_id"`
	PostID    int       `json:"post_id"`
	Content   string    `json:"content"`
	Created   time.Time `json:"created"`
}

type Post struct {
	PostID   int       `json:"post_id"`
	UserID   int       `json:"user_id"`
	Content  string    `json:"content"`
	Image    string    `json:"image"`
	IsPublic bool      `json:"is_public"`
	Created  time.Time `json:"created"`
	Comments []Comment `json:"comments"`
}

type Comment struct {
	CommentID int       `json:"comment_id"`
	UserID    int       `json:"user_id"`
	PostID    int       `json:"post_id"`
	Content   string    `json:"content"`
	Created   time.Time `json:"created"`
}

type Event struct {
	EventID     int       `json:"event_id"`
	UserID      int       `json:"user_id"`
	GroupID     int       `json:"group_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Image       string    `json:"image"`
	EventDate   time.Time `json:"event_date"`
	Created     time.Time `json:"created"`
}

type Message struct {
	MessageID int       `json:"message_id"`
	FromID    int       `json:"from_id"`
	ToID      int       `json:"to_id"`
	Content   string    `json:"content"`
	IsSeen    bool      `json:"is_seen"`
	Created   time.Time `json:"created"`
}
