package repository

import (
	"context"
	"database/sql"
	"errors"

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
	return nil
}
