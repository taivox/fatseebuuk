package main

import (
	"context"
	"errors"
	"net/http"
	"strings"
)

func (app *application) enableCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, X-CSRF-Token, Authorization")
			return
		} else {
			h.ServeHTTP(w, r)
		}
	})
}

// auth required handler
func (app *application) Authorize(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/login" || r.URL.Path == "/register" {
			next.ServeHTTP(w, r)
			return
		}

		userID, err := app.GetTokenFromHeaderAndVerify(w, r)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), "user_id", userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (app *application) GetTokenFromHeaderAndVerify(w http.ResponseWriter, r *http.Request) (int, error) {
	w.Header().Add("Vary", "Authorization")

	// get auth header
	authHeader := r.Header.Get("Authorization")
	// sanity check
	if authHeader == "" {
		return 0, errors.New("no auth header")
	}

	// split the header on spaces
	headerParts := strings.Split(authHeader, " ")
	if len(headerParts) != 2 {
		return 0, errors.New("invalid auth header")

	}

	// check to see if we have the word Bearer
	if headerParts[0] != "Bearer" {
		return 0, errors.New("invalid auth header")
	}
	cookie := headerParts[1]
	userID, err := app.DB.ValidateUUID(cookie)
	if err != nil {
		return 0, errors.New("invalid auth header")
	}

	return userID, nil
}

func (app *application) GetTokenFromHeader(w http.ResponseWriter, r *http.Request) string {
	w.Header().Add("Vary", "Authorization")

	authHeader := r.Header.Get("Authorization")

	headerParts := strings.Split(authHeader, " ")

	cookie := headerParts[1]

	return cookie
}
