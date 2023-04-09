package main

import (
	"back-end/database/repository"
	"back-end/models"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/mail"
	"regexp"
	"strconv"
)

type JSONResponse struct {
	Error   bool        `json:"error"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func (app *application) writeJSON(w http.ResponseWriter, status int, data interface{}, headers ...http.Header) error {
	out, err := json.Marshal(data)
	if err != nil {
		return err
	}

	if len(headers) > 0 {
		for key, val := range headers[0] {
			w.Header()[key] = val
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, err = w.Write(out)
	if err != nil {
		return err
	}

	return nil
}

func (app *application) readJSON(w http.ResponseWriter, r *http.Request, data interface{}) error {
	maxBytes := 1024 * 1024 // one megabyte
	r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))

	dec := json.NewDecoder(r.Body)

	dec.DisallowUnknownFields()

	err := dec.Decode(data)
	if err != nil {
		return err
	}

	err = dec.Decode(&struct{}{}) // throw away variable to check that only one JSON file is sent
	if err != io.EOF {            // End of file
		return errors.New("body must only contain a single JSON value")
	}

	return nil
}

func (app *application) errorJSON(w http.ResponseWriter, err error, status ...int) error {
	statusCode := http.StatusBadRequest

	if len(status) > 0 {
		statusCode = status[0]
	}

	var payload JSONResponse
	payload.Error = true
	payload.Message = err.Error()

	return app.writeJSON(w, statusCode, payload)
}

func getID(str, regexStr string) (int, error) {
	matches := regexp.MustCompile(regexStr).FindAllString(str, -1)

	if len(matches) > 0 {
		lastMatch := matches[len(matches)-1]

		return strconv.Atoi(lastMatch)
	}

	return 0, fmt.Errorf("invalid id")
}

func (app *application) validateRegisterData(rd *models.RegisterData) error {
	ctx, cancel := context.WithTimeout(context.Background(), repository.DbTimeout)
	defer cancel()

	_, err := mail.ParseAddress(rd.Email)
	if err != nil {
		return err
	}

	var email string
	query := `SELECT email FROM users WHERE email = ?`

	row := app.DB.DB.QueryRowContext(ctx, query, rd.Email)
	err = row.Scan(&email)
	if err != sql.ErrNoRows && err != nil {
		return err
	}

	if email != "" {
		return errors.New("email already exists")
	}

	if !HasValidName(rd.FirstName) || !HasValidName(rd.LastName) {
		return errors.New("not a valid name")
	}

	if rd.Password != rd.ConfirmPassword {
		return errors.New("passwords don't match")
	}

	return nil
}

func HasValidName(name string) bool {
	regex := regexp.MustCompile("^[A-Za-z]+([' -][A-Za-z]+)*$")
	return regex.MatchString(name)
}
