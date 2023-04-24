package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"back-end/models"
)

// Functions in this file will insert data to database

func (m *SqliteDB) Register(rd *models.RegisterData) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `INSERT INTO
				 users (first_name, last_name, nickname, date_of_birth, profile_image, about, email, password)
			 VALUES (?,?,?,?,?,?,?,?)`

	_, err := m.DB.ExecContext(ctx, stmt,
		rd.FirstName,
		rd.LastName,
		rd.Nickname,
		rd.DateOfBirth,
		rd.ProfileImage,
		rd.About,
		rd.Email,
		rd.Password,
	)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) AddSession(userID int, uuid string) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `INSERT INTO
				 sessions (user_id, session_token)
			 VALUES (?,?)`

	_, err := m.DB.ExecContext(ctx, stmt, userID, uuid)
	if err != nil {
		return err
	}
	return nil
}

func (m *SqliteDB) RemoveSession(uuid string) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `DELETE FROM sessions WHERE session_token = ?`

	_, err := m.DB.ExecContext(ctx, stmt, uuid)
	if err != nil {
		return err
	}
	return nil
}

// TODO: Enri tahab siia funcile paremat nime!!!
func (m *SqliteDB) AddUserToGroup(userID, groupID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `SELECT user_id FROM groups_members WHERE user_id = ? AND group_id = ?`
	row := m.DB.QueryRowContext(ctx, query, userID, groupID)
	var id int

	err := row.Scan(&id)
	if err != sql.ErrNoRows && err != nil {
		return err
	}

	if id != 0 {
		return errors.New("user entry already exists")
	}

	stmt := `INSERT INTO
				groups_members (user_id, group_id, request_pending, invitation_pending)
			 VALUES (?,?,?,?)`

	_, err = m.DB.ExecContext(ctx, stmt, userID, groupID, true, false)
	if err != nil {
		return err
	}

	var groupCreatorID int
	query = `SELECT user_id FROM groups WHERE group_id = ?`
	row = m.DB.QueryRowContext(ctx, query, groupID)
	err = row.Scan(&groupCreatorID)
	if err != nil {
		return err
	}
	err = m.CreateNotification(groupCreatorID, userID, "group_request", "calendar-star", fmt.Sprintf("/groups/%d", groupID))
	if err != nil {
		return err
	}

	return nil
}

// Insert notification to database. Takes in user ID who the notification belongs to and notification type.
// Notification type can be "group_invite", "group_request", "friend_request, "event_created", "like"
func (m *SqliteDB) CreateNotification(toID, fromID int, notificationType, boxiconsName, link string) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `INSERT INTO
				notifications (to_id, from_id, type, boxicons_name, link)
			VALUES (?,?,?,?,?)`

	_, err := m.DB.ExecContext(ctx, stmt, toID, fromID, notificationType, boxiconsName, link)
	if err != nil {
		return err
	}
	return nil
}

func (m *SqliteDB) RemoveNotification(userID, friendID int, notificationType string) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `DELETE FROM
				notifications
			WHERE 
				to_id = ?
			AND
				from_id = ?
			AND
				type = ?`

	_, err := m.DB.ExecContext(ctx, stmt, userID, friendID, notificationType)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) RemoveGroupMembership(groupID, userID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `DELETE FROM groups_members WHERE group_id = ? AND user_id = ?`

	_, err := m.DB.ExecContext(ctx, stmt, groupID, userID)
	if err != nil {
		return err
	}
	return nil
}

func (m *SqliteDB) RemoveGroupRequest(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	var groupOwnerID, userID int
	query := `SELECT g.user_id, gm.user_id FROM groups_members AS gm
			INNER JOIN groups AS g ON gm.group_id = g.group_id
			WHERE gm.groups_members_id = ?`
	row := m.DB.QueryRowContext(ctx, query, id)
	err := row.Scan(&groupOwnerID, &userID)
	if err != nil {
		return err
	}

	stmt := `DELETE FROM groups_members WHERE groups_members_id = ?`

	_, err = m.DB.ExecContext(ctx, stmt, id)
	if err != nil {
		return err
	}

	err = m.RemoveNotification(groupOwnerID, userID, "group_request")
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) ApproveGroupRequest(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `UPDATE 
				groups_members
			SET
				request_pending = false, invitation_pending = false
			WHERE
				groups_members_id = ?`

	_, err := m.DB.ExecContext(ctx, stmt, id)
	if err != nil {
		return err
	}

	var groupOwnerID, userID int
	query := `SELECT g.user_id, gm.user_id FROM groups_members AS gm 
			INNER JOIN groups AS g ON gm.group_id = g.group_id
			WHERE gm.groups_members_id = ?`
	row := m.DB.QueryRowContext(ctx, query, id)
	err = row.Scan(&groupOwnerID, &userID)
	if err != nil {
		return err
	}

	err = m.RemoveNotification(groupOwnerID, userID, "group_request")
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) AddFriend(userID, friendID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `INSERT INTO 
				friends (user_id, friend_id, request_pending)
			VALUES
				(?, ?, ?)`

	_, err := m.DB.ExecContext(ctx, stmt, userID, friendID, true)
	if err != nil {
		return err
	}

	err = m.CreateNotification(friendID, userID, "friend_request", "user-plus", "/friends")
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) RemoveFriend(userID, friendID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (friend_id = ? AND user_id = ?)`

	_, err := m.DB.ExecContext(ctx, stmt, userID, friendID, userID, friendID)
	if err != nil {
		return err
	}

	err = m.RemoveNotification(userID, friendID, "friend_request")
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	return nil
}

func (m *SqliteDB) ApproveFriendRequest(userID, friendID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `UPDATE 
				friends
			SET
				request_pending = false
			WHERE
				(user_id = ? AND friend_id = ?)`

	_, err := m.DB.ExecContext(ctx, stmt, friendID, userID)
	if err != nil {
		return err
	}

	err = m.RemoveNotification(userID, friendID, "friend_request")
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) AddNewPost(post *models.Post, userID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `INSERT INTO posts (user_id, content, image) VALUES (?,?,?)`
	_, err := m.DB.ExecContext(ctx, stmt, userID, post.Content, post.Image)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) AddNewGroupPost(post *models.Post, userID, groupID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `INSERT INTO groups_posts (user_id, group_id, content, image) VALUES (?,?,?,?)`
	_, err := m.DB.ExecContext(ctx, stmt, userID, groupID, post.Content, post.Image)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) AddNewGroup(group *models.Group) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `INSERT INTO groups (title, description, user_id, image) VALUES (?,?,?,?)`
	_, err := m.DB.ExecContext(ctx, stmt, group.Title, group.Description, group.UserID, group.Image)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) AddNewEvent(event *models.Event) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `INSERT INTO events (user_id, group_id, title, description, image, event_date) VALUES (?,?,?,?,?,?)`
	_, err := m.DB.ExecContext(ctx, stmt, event.Poster.UserID, event.GroupID, event.Title, event.Description, event.Image, event.EventDate)
	if err != nil {
		return err
	}

	return nil
}
