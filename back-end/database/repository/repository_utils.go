package repository

import (
	"sort"
	"strconv"
	"strings"

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

func joinIntArray(numbers []int) string {
	strs := make([]string, len(numbers))
	for i, num := range numbers {
		strs[i] = strconv.Itoa(num)
	}
	return strings.Join(strs, ",")
}

func stringToIntArray(numbersString string) []int {
	strs := strings.Split(numbersString, ",")
	numbers := make([]int, len(strs))
	for i, str := range strs {
		num, err := strconv.Atoi(str)
		if err != nil {
			panic(err)
		}
		numbers[i] = num
	}
	return numbers
}

func isUserAllowed(userIDs []int, currentUserID int) bool {
	for _, uID := range userIDs {
		if currentUserID == uID {
			return true
		}
	}
	return false
}
