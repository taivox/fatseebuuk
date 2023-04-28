package main

import (
	"context"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/mail"
	"net/smtp"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"back-end/database/repository"
	"back-end/models"

	"github.com/gorilla/websocket"
)

type JSONResponse struct {
	Error   bool        `json:"error"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	UserID  int         `json:"user_id,omitempty"`
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

	err := validateEmail(rd.Email)
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

	if !hasValidName(rd.FirstName) || !hasValidName(rd.LastName) {
		return errors.New("not a valid name")
	}

	if rd.Password != rd.ConfirmPassword {
		return errors.New("passwords don't match")
	}

	return nil
}

func (app *application) validateLoginData(ld *models.LoginData) error {
	err := validateEmail(ld.Email)
	if err != nil {
		return err
	}

	var password string

	query := `SELECT password FROM users WHERE email = ?`
	row := app.DB.DB.QueryRow(query, ld.Email)

	err = row.Scan(&password)
	if err != nil {
		return errors.New("invalid email or password")
	}
	err = validatePasswordHash(ld.Password, password)
	if err != nil {
		return errors.New("invalid email or password")
	}
	return nil
}

func hasValidName(name string) bool {
	regex := regexp.MustCompile("^[A-Za-z]+([' -][A-Za-z]+)*$")
	return regex.MatchString(name)
}

func validateEmail(email string) error {
	_, err := mail.ParseAddress(email)
	return err
}

func saveImageToFile(imageBase64 string, folderName string) (string, error) {
	data := strings.Split(imageBase64, ",")[1]

	imageBytes, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		return "", err
	}

	fileName := fmt.Sprintf("%d", time.Now().UnixNano())

	extension := strings.Split(strings.TrimPrefix(imageBase64, "data:image/"), ";")[0]

	fileNameWithExtension := fmt.Sprintf("%s.%s", fileName, extension)

	path := fmt.Sprintf(`../front-end/public/%s/%s`, folderName, fileNameWithExtension)

	imageFile, err := os.Create(path)
	if err != nil {
		return "", err
	}
	defer imageFile.Close()

	_, err = imageFile.Write(imageBytes)
	if err != nil {
		os.Remove(path)
		return "", err
	}

	return fileNameWithExtension, nil
}

func sendEmail(rd *models.RegisterData) {
	// Set up authentication information.
	auth := smtp.PlainAuth("", "fatseebuuk@gmail.com", "cubkznfrjpmyaqcf", "smtp.gmail.com")

	msg := fmt.Sprintf("Subject: Welcome to the mysterious world of Fatseebuuk! \nDear %s %s, nice to have you on board, please never leave!", rd.FirstName, rd.LastName)

	smtp.SendMail(
		"smtp.gmail.com:587",
		auth,
		"fatseebuuk@gmail.com",
		[]string{rd.Email},
		[]byte(msg),
	)
}

func SetUserOffline(conn *websocket.Conn) {
	for key, val := range models.OnlineUsers {
		if val == conn {
			delete(models.OnlineUsers, key)
			break
		}
	}
}
