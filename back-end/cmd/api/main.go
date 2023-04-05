package main

import (
	"log"

	"back-end/database/repository"

	_ "github.com/mattn/go-sqlite3"
)

type application struct {
	DB repository.SqliteDB
}

func main() {
	var app application

	conn, err := openDB()
	if err != nil {
		log.Fatal(err)
	}
	app.DB = repository.SqliteDB{DB: conn}

	defer app.DB.Connection().Close()
}
