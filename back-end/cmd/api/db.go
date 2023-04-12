package main

import (
	"database/sql"
	"os"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

func openDB() (*sql.DB, error) {
	var err error
	dbPath := "./database/social_network.db"
	exists := true

	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		exists = false
	}

	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	if !exists {
		path := "./database/migrate/"
		fileNames, err := os.ReadDir(path)
		if err != nil {
			return nil, err
		}
		for _, name := range fileNames {
			fileName := name.Name()
			if !strings.Contains(fileName, ".down") {
				readFile, err := os.ReadFile(path + fileName)
				if err != nil {
					return nil, err
				}
				_, err = db.Exec(string(readFile))
				if err != nil {
					return nil, err
				}
			}
		}

	}

	return db, nil
}
