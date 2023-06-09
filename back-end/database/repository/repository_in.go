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

	// remove notifications from group owner if there is any
	var groupOwnerID int
	query := `SELECT user_id FROM groups WHERE group_id = ?`
	row := m.DB.QueryRowContext(ctx, query, groupID)
	err = row.Scan(&groupOwnerID)
	if err != nil {
		return err
	}

	stmt = `DELETE FROM notifications WHERE to_id = ? AND from_id = ? AND type = ? AND link = ?`
	_, err = m.DB.ExecContext(ctx, stmt, groupOwnerID, userID, "group_request", fmt.Sprintf("/groups/%d", groupID))
	if err != nil && err != sql.ErrNoRows {
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

	var isPublic bool
	stmt := `SELECT is_public FROM users WHERE user_id = ?`
	err := m.DB.QueryRowContext(ctx, stmt, friendID).Scan(&isPublic)
	if err != nil {
		return err
	}

	if isPublic {
		stmt = `INSERT INTO 
					friends (user_id, friend_id, request_pending)
				VALUES
					(?, ?, ?)`

		_, err = m.DB.ExecContext(ctx, stmt, userID, friendID, false)
		if err != nil {
			return err
		}
	} else {
		stmt = `INSERT INTO 
					friends (user_id, friend_id, request_pending)
				VALUES
					(?, ?, ?)`

		_, err = m.DB.ExecContext(ctx, stmt, userID, friendID, true)
		if err != nil {
			return err
		}

		err = m.CreateNotification(friendID, userID, "friend_request", "user-plus", "/friends")
		if err != nil {
			return err
		}
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

	if post.IsAlmostPrivate {
		selectedUsers := joinIntArray(post.SelectedUsers)

		stmt := `INSERT INTO posts (user_id, content, image, is_almost_private, selected_users) VALUES (?,?,?,true,?)`
		_, err := m.DB.ExecContext(ctx, stmt, userID, post.Content, post.Image, selectedUsers)
		if err != nil {
			return err
		}
	} else {
		stmt := `INSERT INTO posts (user_id, content, image, is_almost_private) VALUES (?,?,?,false)`
		_, err := m.DB.ExecContext(ctx, stmt, userID, post.Content, post.Image)
		if err != nil {
			return err
		}
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
	result, err := m.DB.ExecContext(ctx, stmt, group.Title, group.Description, group.UserID, group.Image)
	if err != nil {
		return err
	}

	groupID, err := result.LastInsertId()
	if err != nil {
		return nil
	}

	// add group owner to group members
	stmt = `INSERT INTO groups_members (user_id, group_id, invitation_pending, request_pending) VALUES (?,?,?,?)`
	_, err = m.DB.ExecContext(ctx, stmt, group.UserID, groupID, false, false)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) AddNewEvent(event *models.Event) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `INSERT INTO events (user_id, group_id, title, description, image, event_date) VALUES (?,?,?,?,?,?)`
	result, err := m.DB.ExecContext(ctx, stmt, event.Poster.UserID, event.GroupID, event.Title, event.Description, event.Image, event.EventDate)
	if err != nil {
		return err
	}

	eventID, err := result.LastInsertId()
	if err != nil {
		return err
	}

	// get all group members
	var groupMembers []int
	query := `SELECT user_id FROM groups_members WHERE group_id = ?`
	rows, err := m.DB.QueryContext(ctx, query, event.GroupID)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var userID int
		err = rows.Scan(&userID)
		if err != nil {
			return err
		}

		groupMembers = append(groupMembers, userID)
	}

	// create notifications for all group members
	for _, userID := range groupMembers {
		err = m.CreateNotification(userID, event.Poster.UserID, "event_created", "calendar", fmt.Sprintf("/groups/%d/events/%d", event.GroupID, eventID))
		if err != nil {
			return err
		}
	}

	return nil
}

func (m *SqliteDB) AddNewGroupComment(userID, postID int, content string) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `INSERT INTO groups_comments (user_id, post_id, content) VALUES (?, ?, ?)`
	_, err := m.DB.ExecContext(ctx, stmt, userID, postID, content)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) AddNewComment(userID, postID int, content string) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)`

	_, err := m.DB.ExecContext(ctx, stmt, userID, postID, content)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) TogglePostLike(like *models.Like) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	var stmt string
	if like.BelongsToGroup {
		stmt = `DELETE FROM groups_post_likes WHERE post_id = ? AND user_id = ?`

		res, err := m.DB.ExecContext(ctx, stmt, like.PostID, like.UserID)
		if err != nil {
			return err
		}

		rowsAffected, err := res.RowsAffected()
		if err != nil {
			return err
		}

		if rowsAffected == 0 {
			stmt = `INSERT INTO groups_post_likes (post_id, user_id) VALUES (?, ?)`
			_, err := m.DB.ExecContext(ctx, stmt, like.PostID, like.UserID)
			if err != nil {
				return err
			}
		}
	} else {
		stmt = `DELETE FROM post_likes WHERE post_id = ? AND user_id = ?`

		res, err := m.DB.ExecContext(ctx, stmt, like.PostID, like.UserID)
		if err != nil {
			return err
		}

		rowsAffected, err := res.RowsAffected()
		if err != nil {
			return err
		}

		if rowsAffected == 0 {
			stmt = `INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)`
			_, err := m.DB.ExecContext(ctx, stmt, like.PostID, like.UserID)
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func (m *SqliteDB) ToggleCommentLike(like *models.Like) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	var stmt string
	if like.BelongsToGroup {
		stmt = `DELETE FROM groups_comment_likes WHERE comment_id = ? AND user_id = ?`

		res, err := m.DB.ExecContext(ctx, stmt, like.CommentID, like.UserID)
		if err != nil {
			return err
		}

		rowsAffected, err := res.RowsAffected()
		if err != nil {
			return err
		}

		if rowsAffected == 0 {
			stmt = `INSERT INTO groups_comment_likes (comment_id, user_id) VALUES (?, ?)`
			_, err := m.DB.ExecContext(ctx, stmt, like.CommentID, like.UserID)
			if err != nil {
				return err
			}
		}
	} else {
		stmt = `DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?`

		res, err := m.DB.ExecContext(ctx, stmt, like.CommentID, like.UserID)
		if err != nil {
			return err
		}

		rowsAffected, err := res.RowsAffected()
		if err != nil {
			return err
		}

		if rowsAffected == 0 {
			stmt = `INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)`
			_, err := m.DB.ExecContext(ctx, stmt, like.CommentID, like.UserID)
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func (m *SqliteDB) AddGroupInvite(userID, groupID, friendID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `INSERT INTO groups_members (user_id, group_id, request_pending, invitation_pending) VALUES (?,?,?,?)`
	_, err := m.DB.ExecContext(ctx, stmt, friendID, groupID, false, true)
	if err != nil {
		return err
	}

	stmt = `INSERT INTO notifications (to_id, from_id, type, boxicons_name, link) VALUES (?,?,?,?,?)`
	_, err = m.DB.ExecContext(ctx, stmt, friendID, userID, "group_invite", "user-plus", fmt.Sprintf("/groups/%d", groupID))
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) ApproveGroupInvite(userID, groupID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `UPDATE groups_members SET invitation_pending = ?, request_pending = ? WHERE user_id = ? AND group_id = ?`
	_, err := m.DB.ExecContext(ctx, stmt, false, false, userID, groupID)
	if err != nil {
		return err
	}

	// delete notification
	stmt = `DELETE FROM notifications WHERE to_id = ? AND type = ? AND link = ?`
	_, err = m.DB.ExecContext(ctx, stmt, userID, "group_invite", fmt.Sprintf("/groups/%d", groupID))
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) UpdateCoverImage(userID int, imageName string) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `UPDATE users SET cover_image = ? WHERE user_id = ?`
	_, err := m.DB.ExecContext(ctx, stmt, imageName, userID)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) AddEventResponse(userID, eventID, groupID int, responseType string) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `UPDATE events_attendance SET is_going = ? WHERE user_id = ? AND event_id = ?`
	res, err := m.DB.ExecContext(ctx, stmt, responseType == "accept", userID, eventID)
	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		stmt = `INSERT INTO events_attendance (user_id, event_id, is_going) VALUES (?, ?, ?)`
		_, err := m.DB.ExecContext(ctx, stmt, userID, eventID, responseType == "accept")
		if err != nil {
			return err
		}
	}

	stmt = `DELETE FROM notifications WHERE to_id = ? AND link = ?`
	_, err = m.DB.ExecContext(ctx, stmt, userID, fmt.Sprintf("/groups/%d/events/%d", groupID, eventID))
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) ChangeUserPrivacy(userID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `UPDATE users SET is_public = NOT is_public WHERE user_id = ?`
	_, err := m.DB.ExecContext(ctx, stmt, userID)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) AddMessage(fromID, toID int, content string) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `INSERT INTO messages (from_id, to_id, content) VALUES (?, ?, ?)`
	_, err := m.DB.ExecContext(ctx, stmt, fromID, toID, content)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) GroupAddMessage(fromID, groupID int, content string) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	stmt := `INSERT INTO groups_messages (from_id, group_id, content) VALUES (?, ?, ?)`
	_, err := m.DB.ExecContext(ctx, stmt, fromID, groupID, content)
	if err != nil {
		return err
	}

	return nil
}
