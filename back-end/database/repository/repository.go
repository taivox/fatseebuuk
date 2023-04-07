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

const dbTimeout = time.Second * 3

func (m *SqliteDB) Connection() *sql.DB {
	return m.DB
}

func (m *SqliteDB) GetUserByID(id int) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
			SELECT
				user_id, first_name, last_name, COALESCE(nickname,''), date_of_birth,
				COALESCE(profile_picture,'default_profile_picture.png'), COALESCE(cover_picture, 'default_cover_picture.png'),
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
		&user.ProfilePicture,
		&user.CoverPicture,
		&user.About,
		&user.IsPublic,
	)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (m *SqliteDB) GetAllGroups() ([]*models.Group, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
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
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	//Get group
	query := `SELECT group_id, title, description, created, user_id, COALESCE(image, 'default_group_image') FROM groups WHERE group_id = ?`

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
				post_id, user_id, group_id, content, COALESCE(image, 'default_group_image'), created
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
		err := pRows.Scan(
			&post.PostID,
			&post.UserID,
			&post.GroupID,
			&post.Content,
			&post.Image,
			&post.Created,
		)
		if err != nil {
			return nil, err
		}

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
				&comment.UserID,
				&comment.PostID,
				&comment.Content,
				&comment.Created,
			)
			if err != nil {
				return nil, err
			}
			post.Comments = append(post.Comments, comment)
		}
		group.Posts = append(group.Posts, post)
	}
	return &group, nil
}
