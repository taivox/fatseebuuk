package repository

import (
	"back-end/models"
	"context"
	"database/sql"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

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

func (m *SqliteDB) GetGroupByID(id int) (*models.Group, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DbTimeout)
	defer cancel()

	//Get group
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

	//Get group posts
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

		//Get post comments
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
