package repository

import (
	"context"
	"database/sql"
	"time"

	"back-end/models"

	_ "github.com/mattn/go-sqlite3"
)

// Functions in this file will get data from database

type SqliteDB struct {
	DB *sql.DB
}

const DbTimeout = time.Second * 3

func (m *SqliteDB) Connection() *sql.DB {
	return m.DB
}

func (m *SqliteDB) GetUserByID(id int) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `
			SELECT
				user_id, first_name, last_name, COALESCE(nickname,''), date_of_birth,
				COALESCE(profile_image,'default_profile_image.png'), COALESCE(cover_image, 'default_cover_image.png'),
				COALESCE(about,''), is_public
			FROM
				users 
			WHERE
				user_id = ?`
	row := m.DB.QueryRowContext(ctx, query, id)
	var user models.User

	err := row.Scan(
		&user.UserID,
		&user.FirstName,
		&user.LastName,
		&user.Nickname,
		&user.DateOfBirth,
		&user.ProfileImage,
		&user.CoverImage,
		&user.About,
		&user.IsPublic,
	)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (m *SqliteDB) GetAllGroups() ([]*models.Group, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `SELECT
				group_id, title, description, created, user_id, COALESCE(image, 'default_group_image.png')
			FROM
				groups`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []*models.Group

	for rows.Next() {
		var group models.Group
		err := rows.Scan(
			&group.GroupID,
			&group.Title,
			&group.Description,
			&group.Created,
			&group.UserID,
			&group.Image,
		)
		if err != nil {
			return nil, err
		}

		groups = append(groups, &group)
	}

	return groups, nil
}

func (m *SqliteDB) GetUserPosts(profileID, currentUserID int) ([]*models.Post, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `SELECT post_id, user_id, content, COALESCE(image, ''),created, is_almost_private, selected_users FROM posts WHERE user_id = ? ORDER BY CREATED DESC`

	rows, err := m.DB.QueryContext(ctx, query, profileID)
	if err != nil {
		return nil, err
	}
	var posts []*models.Post

	for rows.Next() {
		var post models.Post
		var userID int
		var selectedUsers string
		rows.Scan(
			&post.PostID,
			&userID,
			&post.Content,
			&post.Image,
			&post.Created,
			&post.IsAlmostPrivate,
			&selectedUsers,
		)

		if post.IsAlmostPrivate {
			allowedUsersIDs := stringToIntArray(selectedUsers)
			if !isUserAllowed(allowedUsersIDs, currentUserID) {
				continue
			}
		}

		// Get user for this post
		var user models.User
		query = `SELECT user_id, first_name, last_name, COALESCE(profile_image, 'default_profile_image.png') FROM users WHERE user_id = ?`
		row := m.DB.QueryRowContext(ctx, query, userID)
		row.Scan(
			&user.UserID,
			&user.FirstName,
			&user.LastName,
			&user.ProfileImage,
		)
		post.Poster = user

		// Get comments for this post
		var commentUserID int
		query = `SELECT comment_id, user_id, post_id, content, created FROM comments WHERE post_id = ?`
		cRows, err := m.DB.QueryContext(ctx, query, post.PostID)
		if err != nil {
			return nil, err
		}
		for cRows.Next() {
			var comment models.Comment
			cRows.Scan(
				&comment.CommentID,
				&commentUserID,
				&comment.PostID,
				&comment.Content,
				&comment.Created,
			)

			// Get user for this comment
			var commentUser models.User
			query = `SELECT user_id, first_name, last_name, COALESCE(profile_image,'default_profile_image.png') FROM users WHERE user_id = ?`
			row = m.DB.QueryRowContext(ctx, query, commentUserID)
			row.Scan(
				&commentUser.UserID,
				&commentUser.FirstName,
				&commentUser.LastName,
				&commentUser.ProfileImage,
			)

			comment.Poster = commentUser

			// Get likes for this comment
			query = `SELECT COUNT(*) FROM comment_likes WHERE comment_id = ?`
			row = m.DB.QueryRowContext(ctx, query, comment.CommentID)
			row.Scan(&comment.Likes)

			post.Comments = append(post.Comments, comment)
		}

		post.Comments = SortCommentsByCreated(post.Comments)

		// Get likes for this post
		query = `SELECT COUNT(*) FROM post_likes WHERE post_id = ?`
		row = m.DB.QueryRowContext(ctx, query, post.PostID)
		row.Scan(&post.Likes)

		posts = append(posts, &post)
	}

	return posts, nil
}

func (m *SqliteDB) GetUserFeed(id int) ([]*models.Post, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	// Get all friends from the database
	var friends []int
	var posts []*models.Post
	query := `SELECT friend_id FROM friends WHERE user_id = ? AND request_pending = false UNION SELECT user_id FROM friends WHERE friend_id = ? AND request_pending = false`

	rows, err := m.DB.QueryContext(ctx, query, id, id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var friend int
		err = rows.Scan(&friend)
		if err != nil {
			return nil, err
		}
		friends = append(friends, friend)
	}

	// Get all friends' posts
	for _, friendID := range friends {
		query = `SELECT post_id, user_id, content, COALESCE(image, ''),created, is_almost_private, selected_users FROM posts WHERE user_id = ?`
		rows, err := m.DB.QueryContext(ctx, query, friendID)
		if err != nil {
			return nil, err
		}
		for rows.Next() {
			var post models.Post
			var userID int
			var selectedUsers string
			rows.Scan(
				&post.PostID,
				&userID,
				&post.Content,
				&post.Image,
				&post.Created,
				&post.IsAlmostPrivate,
				&selectedUsers,
			)

			if post.IsAlmostPrivate {
				allowedUsersIDs := stringToIntArray(selectedUsers)
				if !isUserAllowed(allowedUsersIDs, id) {
					continue
				}
			}

			// Get user for this post
			var user models.User
			query = `SELECT user_id, first_name, last_name, COALESCE(profile_image, 'default_profile_image.png') FROM users WHERE user_id = ?`
			row := m.DB.QueryRowContext(ctx, query, userID)
			row.Scan(
				&user.UserID,
				&user.FirstName,
				&user.LastName,
				&user.ProfileImage,
			)
			post.Poster = user

			// Get comments for this post
			var commentUserID int
			query = `SELECT comment_id, user_id, post_id, content, created FROM comments WHERE post_id = ?`
			cRows, err := m.DB.QueryContext(ctx, query, post.PostID)
			if err != nil {
				return nil, err
			}
			for cRows.Next() {
				var comment models.Comment
				cRows.Scan(
					&comment.CommentID,
					&commentUserID,
					&comment.PostID,
					&comment.Content,
					&comment.Created,
				)

				// Get user for this comment
				var commentUser models.User
				query = `SELECT user_id, first_name, last_name, COALESCE(profile_image,'default_profile_image.png') FROM users WHERE user_id = ?`
				row = m.DB.QueryRowContext(ctx, query, commentUserID)
				row.Scan(
					&commentUser.UserID,
					&commentUser.FirstName,
					&commentUser.LastName,
					&commentUser.ProfileImage,
				)

				comment.Poster = commentUser

				// Get likes for this comment
				query = `SELECT COUNT(*) FROM comment_likes WHERE comment_id = ?`
				row = m.DB.QueryRowContext(ctx, query, comment.CommentID)
				row.Scan(&comment.Likes)

				post.Comments = append(post.Comments, comment)
			}

			post.Comments = SortCommentsByCreated(post.Comments)

			// Get likes for this post
			query = `SELECT COUNT(*) FROM post_likes WHERE post_id = ?`
			row = m.DB.QueryRowContext(ctx, query, post.PostID)
			row.Scan(&post.Likes)

			posts = append(posts, &post)
		}
	}

	posts = SortPostsByCreated(posts)

	return posts, nil
}

func (m *SqliteDB) GetGroupByID(id int) (*models.Group, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	// Get group
	query := `SELECT group_id, title, description, created, user_id, COALESCE(image, 'default_group_image.png') FROM groups WHERE group_id = ?`

	row := m.DB.QueryRowContext(ctx, query, id)
	var group models.Group

	err := row.Scan(
		&group.GroupID,
		&group.Title,
		&group.Description,
		&group.Created,
		&group.UserID,
		&group.Image,
	)
	if err != nil {
		return nil, err
	}

	// Get group posts
	query = `SELECT
				post_id, user_id, group_id, content, COALESCE(image, ''), created
			FROM
				groups_posts
			WHERE
				group_id = ?
			ORDER BY created DESC`
	pRows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer pRows.Close()

	for pRows.Next() {
		var post models.GroupPost
		var userID int
		err := pRows.Scan(
			&post.PostID,
			&userID,
			&post.GroupID,
			&post.Content,
			&post.Image,
			&post.Created,
		)

		query = `SELECT COUNT(*) FROM groups_post_likes WHERE post_id = ?`
		row = m.DB.QueryRowContext(ctx, query, post.PostID)
		row.Scan(&post.Likes)

		if err != nil {
			return nil, err
		}

		p, err := m.GetUserByID(userID)
		if err != nil {
			return nil, err
		}
		post.Poster = *p

		// Get post comments
		query = `SELECT * FROM groups_comments WHERE post_id = ?`
		cRows, err := m.DB.QueryContext(ctx, query, post.PostID)
		if err != nil {
			return nil, err
		}
		defer cRows.Close()

		var comment models.GroupComment
		for cRows.Next() {
			err := cRows.Scan(
				&comment.CommentID,
				&userID,
				&comment.PostID,
				&comment.Content,
				&comment.Created,
			)
			if err != nil {
				return nil, err
			}

			query = `SELECT COUNT(*) FROM groups_comment_likes WHERE comment_id = ?`
			row = m.DB.QueryRowContext(ctx, query, comment.CommentID)
			row.Scan(&comment.Likes)

			p, err = m.GetUserByID(userID)
			if err != nil {
				return nil, err
			}
			comment.Poster = *p

			post.Comments = append(post.Comments, comment)
		}

		group.Posts = append(group.Posts, post)
	}

	query = `SELECT user_id FROM groups_members WHERE group_id = ?`
	mRows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer mRows.Close()

	for mRows.Next() {
		var userID int
		err := mRows.Scan(
			&userID,
		)
		if err != nil {
			return nil, err
		}

		p, err := m.GetUserByID(userID)
		if err != nil {
			return nil, err
		}
		group.Members = append(group.Members, *p)
	}

	return &group, nil
}

func (m *SqliteDB) GetGroupByIDForNonMember(id int) (*models.Group, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	// Get group
	query := `SELECT group_id, title, description, created, user_id, COALESCE(image, 'default_group_image.png') FROM groups WHERE group_id = ?`

	row := m.DB.QueryRowContext(ctx, query, id)
	var group models.Group

	err := row.Scan(
		&group.GroupID,
		&group.Title,
		&group.Description,
		&group.Created,
		&group.UserID,
		&group.Image,
	)
	if err != nil {
		return nil, err
	}

	return &group, nil
}

func (m *SqliteDB) GetGroupEvents(id int) (*models.Events, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `SELECT 
				event_id, user_id, group_id, title, description,
				COALESCE(image, 'default_event_image.png'), event_date, created
			FROM
				events
			WHERE
				group_id = ?`

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events models.Events

	var userID int
	now := time.Now()

	for rows.Next() {
		var event models.Event
		err := rows.Scan(
			&event.EventID,
			&userID,
			&event.GroupID,
			&event.Title,
			&event.Description,
			&event.Image,
			&event.EventDate,
			&event.Created,
		)
		if err != nil {
			return nil, err
		}
		p, err := m.GetUserByID(userID)
		if err != nil {
			return nil, err
		}
		event.Poster = *p

		if event.EventDate.Before(now) {
			events.PastEvents = append(events.PastEvents, event)
		} else {
			events.UpcomingEvents = append(events.UpcomingEvents, event)
		}
	}
	return &events, nil
}

func (m *SqliteDB) GetEventByID(id int) (*models.Event, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `SELECT 
				event_id, user_id, group_id, title, description,
				COALESCE(image, 'default_event_image.png'), event_date, created
			FROM
				events
			WHERE
				event_id = ?`

	row := m.DB.QueryRowContext(ctx, query, id)
	var event models.Event
	var userID int

	err := row.Scan(
		&event.EventID,
		&userID,
		&event.GroupID,
		&event.Title,
		&event.Description,
		&event.Image,
		&event.EventDate,
		&event.Created,
	)
	if err != nil {
		return nil, err
	}

	user, err := m.GetUserByID(userID)
	if err != nil {
		return nil, err
	}
	event.Poster = *user

	return &event, nil
}

func (m *SqliteDB) GetUserIDByEmail(email string) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `SELECT user_id FROM users WHERE email = ?`

	row := m.DB.QueryRowContext(ctx, query, email)
	var id int

	err := row.Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}

func (m *SqliteDB) ValidateUUID(uuid string) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `SELECT user_id FROM sessions WHERE session_token = ?`

	row := m.DB.QueryRowContext(ctx, query, uuid)
	var id int

	err := row.Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}

func (m *SqliteDB) ValidateGroupMembership(userID, groupID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()
	query := `SELECT user_id FROM groups_members WHERE user_id = ? AND group_id = ? AND request_pending = false AND invitation_pending = false`

	row := m.DB.QueryRowContext(ctx, query, userID, groupID)
	var id int

	err := row.Scan(&id)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) ValidateGroupOwnership(userID, groupID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()
	query := `SELECT user_id FROM groups WHERE user_id = ? AND group_id = ?`

	row := m.DB.QueryRowContext(ctx, query, userID, groupID)
	var id int

	err := row.Scan(&id)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) GetUserNotifications(id int) ([]models.Notification, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `SELECT
				notification_id, to_id, from_id, type, boxicons_name, link, created
			FROM
				notifications
			WHERE
				to_id = ?`

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var fromID int
	var notifications []models.Notification
	for rows.Next() {
		var notification models.Notification
		err := rows.Scan(
			&notification.NotificationID,
			&notification.ToID,
			&fromID,
			&notification.Type,
			&notification.Boxicons_name,
			&notification.Link,
			&notification.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		user, err := m.GetUserByID(fromID)
		if err != nil {
			return nil, err
		}
		notification.From = *user

		notifications = append(notifications, notification)
	}
	return notifications, nil
}

func (m *SqliteDB) GetGroupRequests(id int) ([]models.GroupRequests, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `SELECT groups_members_id, user_id, group_id FROM groups_members
				WHERE group_id = ? AND request_pending = true`

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}
	var requests []models.GroupRequests
	for rows.Next() {
		var userID int
		var request models.GroupRequests
		err := rows.Scan(&request.RequestID, &userID, &request.GroupID)
		if err != nil {
			return nil, err
		}

		requester, err := m.GetUserByID(userID)
		if err != nil {
			return nil, err
		}
		request.Requester = *requester

		requests = append(requests, request)
	}
	return requests, nil
}

func (m *SqliteDB) GetFriendsList(id int) ([]models.Friend, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `SELECT friend_id, request_pending FROM friends WHERE user_id = ? AND request_pending = false
				UNION SELECT user_id, request_pending FROM friends 
				WHERE friend_id = ? AND request_pending = false`

	rows, err := m.DB.QueryContext(ctx, query, id, id)
	if err != nil {
		return nil, err
	}
	var friends []models.Friend
	for rows.Next() {
		var userID int
		var friend models.Friend
		err := rows.Scan(&userID, &friend.RequestPending)
		if err != nil {
			return nil, err
		}

		user, err := m.GetUserByID(userID)
		if err != nil {
			return nil, err
		}
		friend.Friend = *user

		friends = append(friends, friend)
	}
	return friends, nil
}

// 1 means not friends, 2 means pending request, 3 means friends
func (m *SqliteDB) ValidateFriendStatus(userID, friendID int) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `SELECT friend_id, request_pending FROM friends WHERE user_id = ? AND friend_id = ?
				UNION SELECT user_id, request_pending FROM friends WHERE friend_id = ? AND user_id = ?`

	row := m.DB.QueryRowContext(ctx, query, userID, friendID, userID, friendID)
	var id int
	var requestPending bool

	err := row.Scan(&id, &requestPending)
	if err == sql.ErrNoRows {
		return 1, nil
	}
	if err != nil {
		return 0, err
	}
	if requestPending {
		return 2, nil
	}
	return 3, nil
}

func (m *SqliteDB) GetAllUsers() ([]models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `SELECT user_id, first_name, last_name, COALESCE(profile_image,'default_profile_image.png') FROM users`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	var users []models.User
	for rows.Next() {
		var user models.User
		err = rows.Scan(
			&user.UserID,
			&user.FirstName,
			&user.LastName,
			&user.ProfileImage,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

func (m *SqliteDB) GetGroupInviteList(userID, groupID int) ([]models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	var friends []int
	query := `SELECT friend_id FROM friends WHERE user_id = ? AND request_pending = false
				UNION SELECT user_id FROM friends 
				WHERE friend_id = ? AND request_pending = false`

	rows, err := m.DB.QueryContext(ctx, query, userID, userID)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var friendID int
		err = rows.Scan(&friendID)
		if err != nil {
			return nil, err
		}
		friends = append(friends, friendID)
	}

	//leave out users that are already in the group
	var friendsNotInGroup []int
	for _, friend := range friends {
		query := `SELECT user_id FROM groups_members WHERE user_id = ? AND group_id = ?`
		row := m.DB.QueryRowContext(ctx, query, friend, groupID)
		var id int
		err = row.Scan(&id)
		if err == sql.ErrNoRows {
			friendsNotInGroup = append(friendsNotInGroup, friend)
		}
		if err != nil && err != sql.ErrNoRows {
			return nil, err
		}
	}

	var users []models.User
	for _, friend := range friendsNotInGroup {
		query := `SELECT user_id, first_name, last_name, COALESCE(profile_image,'default_profile_image.png') FROM users WHERE user_id = ?`
		row := m.DB.QueryRowContext(ctx, query, friend)
		var user models.User
		err = row.Scan(
			&user.UserID,
			&user.FirstName,
			&user.LastName,
			&user.ProfileImage,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func (m *SqliteDB) ValidateGroupInviteStatus(userID, groupID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `SELECT user_id FROM groups_members WHERE user_id = ? AND group_id = ? AND invitation_pending = true`

	var id int
	row := m.DB.QueryRowContext(ctx, query, userID, groupID)
	err := row.Scan(&id)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) ValidateGroupRequestStatus(userID, groupID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `SELECT user_id FROM groups_members WHERE user_id = ? AND group_id = ? AND request_pending = true`

	var id int
	row := m.DB.QueryRowContext(ctx, query, userID, groupID)
	err := row.Scan(&id)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) ValidateEventAttendanceStatus(userID, eventID int) error {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	query := `SELECT user_id FROM events_attendance WHERE user_id = ? AND event_id = ? AND is_going = TRUE`

	var id int
	row := m.DB.QueryRowContext(ctx, query, userID, eventID)
	err := row.Scan(&id)
	if err != nil {
		return err
	}

	return nil
}

func (m *SqliteDB) GetEventGoing(id int) ([]models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	var userIDs []int
	query := `SELECT user_id FROM events_attendance WHERE event_id = ? AND is_going = TRUE`

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var userID int
		err = rows.Scan(&userID)
		if err != nil {
			return nil, err
		}
		userIDs = append(userIDs, userID)
	}

	var users []models.User
	for _, userID := range userIDs {
		query := `SELECT user_id, first_name, last_name, COALESCE(profile_image,'default_profile_image.png') FROM users WHERE user_id = ?`
		row := m.DB.QueryRowContext(ctx, query, userID)
		var user models.User
		err = row.Scan(
			&user.UserID,
			&user.FirstName,
			&user.LastName,
			&user.ProfileImage,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func (m *SqliteDB) GetEventNotGoing(id int) ([]models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	var userIDs []int
	query := `SELECT user_id FROM events_attendance WHERE event_id = ? AND is_going = FALSE`

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var userID int
		err = rows.Scan(&userID)
		if err != nil {
			return nil, err
		}
		userIDs = append(userIDs, userID)
	}

	var users []models.User
	for _, userID := range userIDs {
		query := `SELECT user_id, first_name, last_name, COALESCE(profile_image,'default_profile_image.png') FROM users WHERE user_id = ?`
		row := m.DB.QueryRowContext(ctx, query, userID)
		var user models.User
		err = row.Scan(
			&user.UserID,
			&user.FirstName,
			&user.LastName,
			&user.ProfileImage,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func (m *SqliteDB) GetAllMessages(userID int) ([]models.Message, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	var messages []models.Message

	query := `SELECT message_id, from_id, to_id, content, created FROM messages WHERE to_id = ? OR from_id = ? ORDER BY created ASC`

	rows, err := m.DB.QueryContext(ctx, query, userID, userID)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var message models.Message
		err = rows.Scan(
			&message.MessageID,
			&message.FromID,
			&message.ToID,
			&message.Content,
			&message.Created,
		)
		if err != nil {
			return nil, err
		}
		messages = append(messages, message)
	}

	return messages, nil
}

func (m *SqliteDB) GroupGetAllMessages(id int) ([]models.Message, []int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	var messages []models.Message
	var groupUserIDs []int

	query := `SELECT message_id, from_id, group_id, content, created FROM groups_messages WHERE group_id = ? ORDER BY created ASC`

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, groupUserIDs, err
	}
	for rows.Next() {
		var message models.Message
		err = rows.Scan(
			&message.MessageID,
			&message.FromID,
			&message.GroupID,
			&message.Content,
			&message.Created,
		)
		if err != nil {
			return nil, groupUserIDs, err
		}
		messages = append(messages, message)
	}

	query = `SELECT user_id FROM groups_members WHERE group_id = ?`

	rows, err = m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, groupUserIDs, err
	}
	for rows.Next() {
		var userID int
		err = rows.Scan(&userID)
		if err != nil {
			return nil, groupUserIDs, err
		}
		groupUserIDs = append(groupUserIDs, userID)
	}

	return messages, groupUserIDs, nil
}
