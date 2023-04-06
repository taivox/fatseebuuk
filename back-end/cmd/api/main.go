package main

import (
	"fmt"
	"log"
	"net/http"

	"back-end/database/repository"

	_ "github.com/mattn/go-sqlite3"
)

const (
	PORT = 8080
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

	// Start web server
	log.Printf("Starting back-end api server at http://localhost:%d/\n", PORT)
	err = http.ListenAndServe(fmt.Sprintf(":%d", PORT), app.routes())
	if err != nil {
		log.Fatal(err)
	}
}
