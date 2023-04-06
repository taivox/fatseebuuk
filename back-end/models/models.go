package models

import "time"

type User struct {
	UserID         int
	FirstName      string
	LastName       string
	Nickname       string
	DateOfBirth    time.Time
	ProfilePicture string
	CoverPicture   string
	About          string
	Email          string
	Password       string
	Created        time.Time
	IsPublic       bool
}
