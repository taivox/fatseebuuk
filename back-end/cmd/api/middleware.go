package main

import (
	"context"
	"errors"
	"fmt"
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
		userID, err := app.GetTokenFromHeaderAndVerify(w, r)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		fmt.Println("User ID authorizationis: ", userID) // for testing purposes

		//	next.ServeHTTP(w, r)

		ctx := context.WithValue(r.Context(), "userID", userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (app *application) GetTokenFromHeaderAndVerify(w http.ResponseWriter, r *http.Request) (int, error) {
	w.Header().Add("Vary", "Authorization")

	// get auth header
	authHeader := r.Header.Get("Authorization")

	// sanity check
	if authHeader == "" {
		fmt.Println("no auth header")
		return 0, errors.New("no auth header")
	}

	// split the header on spaces
	headerParts := strings.Split(authHeader, " ")
	if len(headerParts) != 2 {
		fmt.Println("invalid auth header")
		return 0, errors.New("invalid auth header")

	}

	// check to see if we have the word Bearer
	if headerParts[0] != "Bearer" {
		fmt.Println("invalid auth header")
		return 0, errors.New("invalid auth header")
	}
	kypsis := headerParts[1]
	userID, err := app.DB.ValidateUUID(kypsis)
	if err != nil {
		fmt.Println("invalid auth header")
		return 0, errors.New("invalid auth header")
	}

	fmt.Println("User ID on", userID)
	fmt.Println("Kypsis on", kypsis)

	return userID, nil
}
