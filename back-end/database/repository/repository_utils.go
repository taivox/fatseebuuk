package repository

import (
	"sort"

	"back-end/models"
)

func SortPostsByCreated(posts []*models.Post) []*models.Post {
	sort.Slice(posts, func(i, j int) bool {
		return posts[i].Created.After(posts[j].Created)
	})
	return posts
}

func SortCommentsByCreated(comments []models.Comment) []models.Comment {
	sort.Slice(comments, func(i, j int) bool {
		return comments[i].Created.Before(comments[j].Created)
	})
	return comments
}
