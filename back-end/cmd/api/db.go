package main

import (
	"database/sql"
	"os"

	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"
)

func openDB() (*sql.DB, error) {
	var err error
	dbPath := "./database/social-network.db"
	exists := true

	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		exists = false
	}

	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	if !exists {
		// pre := "./data/"
		// paths := []string{pre + "tables.sql", pre + "users.sql", pre + "subforums.sql", pre + "threads.sql", pre + "comments.sql", pre + "messages.sql"}
		// for _, path := range paths {
		// 	readFile, err := os.ReadFile(path)
		// 	fileStr := string(readFile)
		// 	_, err = DB.Conn.Exec(fileStr)

		// }
	}

	return db, nil
}
