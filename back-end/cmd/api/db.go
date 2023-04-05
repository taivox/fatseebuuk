package main

import (
	"database/sql"
	"os"
)

func openDB(path string) (*sql.DB, error) {
	var err error
	dbPath := "./database/social-network.db"
	exists := true

	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		exists = false
	}

	db, err := sql.Open("sqlite3", path)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	if !exists {
	}

	return db, nil
}
