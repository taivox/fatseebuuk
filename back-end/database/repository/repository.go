package repository

import (
	"context"
	"database/sql"
	"time"

	"back-end/models"

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

	query := `SELECT user_id, first_name, last_name, COALESCE(nickname,''), date_of_birth,
			COALESCE(profile_picture,'default_profile_picture.png'), COALESCE(cover_picture, 'default_cover_picture.png'),
			COALESCE(about,''), is_public FROM users WHERE user_id = ?`

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
