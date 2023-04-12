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

func (m *SqliteDB) GetUserFeed(id int) ([]*models.Post, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	// Get all friends from the database
	var friends []int
	var posts []*models.Post
	query := `SELECT friend_id FROM friends WHERE user_id = ? UNION SELECT user_id FROM friends WHERE friend_id = ?`

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
		query = `SELECT post_id, user_id, content, COALESCE(image, ''),created, is_public FROM posts WHERE user_id = ?`
		rows, err := m.DB.QueryContext(ctx, query, friendID)
		if err != nil {
			return nil, err
		}
		for rows.Next() {
			var post models.Post
			var userID int
			rows.Scan(
				&post.PostID,
				&userID,
				&post.Content,
				&post.Image,
				&post.Created,
				&post.IsPublic,
			)

			// Get user for this post
			var user models.User
			query = `SELECT user_id, first_name, last_name, profile_image FROM users WHERE user_id = ?`
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
				group_id = ?`
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

			p, err = m.GetUserByID(userID)
			if err != nil {
				return nil, err
			}
			comment.Poster = *p

			post.Comments = append(post.Comments, comment)
		}

		group.Posts = append(group.Posts, post)
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
