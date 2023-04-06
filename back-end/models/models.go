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
