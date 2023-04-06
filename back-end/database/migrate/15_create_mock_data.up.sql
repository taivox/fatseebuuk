INSERT INTO `users` (`first_name`, `last_name`, `nickname`, `date_of_birth`, `profile_picture`, `cover_picture`, `about`, `email`, `password`, `is_public`)
VALUES 
('Alice', 'Smith', 'alice_s', '1990-01-01', 'https://example.com/alice_profile_pic.jpg', 'https://example.com/alice_cover_pic.jpg', 'I am a software engineer.', 'alice@example.com', 'password123', 1),
('Bob', 'Johnson', NULL, '1985-05-15', 'https://example.com/bob_profile_pic.jpg', NULL, 'I love to travel and try new foods.', 'bob@example.com', 'secret456', 0),
('Charlie', 'Lee', 'charlie_lee', '1993-11-30', NULL, 'https://example.com/charlie_cover_pic.jpg', NULL, 'charlie@example.com', 'qwerty789', 1);

INSERT INTO `posts` (`user_id`, `content`, `image`, `is_public`)
VALUES 
(1, 'This is my first post!', 'https://example.com/post_image_1.jpg', 1),
(1, 'Just hanging out with friends. #goodtimes', 'https://example.com/post_image_2.jpg', 1),
(2, 'Trying out this new recipe I found. #yum', NULL, 0),
(2, 'I cant believe its already fall! 🍂', 'https://example.com/post_image_3.jpg', 1),
(3, 'Excited to start my new job!', NULL, 1),
(3, 'Weekend getaway with the family. #familytime', 'https://example.com/post_image_4.jpg', 1);


INSERT INTO `friends` (`user_id`, `friend_id`, `request_pending`)
VALUES
(1, 2, 0),
(1, 3, 1),
(2, 1, 0),
(2, 3, 0),
(3, 1, 0),
(3, 2, 1);

INSERT INTO `comments` (`user_id`, `post_id`, `content`)
VALUES
(1, 1, 'Great post!'),
(2, 1, 'I agree, this is really helpful.'),
(3, 1, 'Thanks for sharing!'),
(2, 2, 'Awesome photo!'),
(1, 3, 'I had a similar experience.'),
(3, 4, 'This is hilarious!'),
(1, 4, 'I love this meme.'),
(3, 4, 'LOL!'),
(1, 5, 'Interesting article.'),
(2, 6, 'I like the way you presented this.'),
(1, 6, 'This is very informative.');


INSERT INTO `post_likes` (`post_id`, `user_id`)
VALUES
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 3),
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(4, 2),
(4, 3),
(5, 1),
(5, 4),
(6, 1),
(6, 3),
(6, 4);

INSERT INTO `comment_likes` (`comment_id`, `user_id`) VALUES 
(1, 2),
(1, 3),
(2, 1),
(2, 3),
(3, 1),
(3, 2),
(4, 2),
(5, 1),
(5, 3),
(6, 1),
(7, 3);


INSERT INTO groups (title, description, user_id, image) VALUES
('Sports Fans', 'A group for sports enthusiasts', 1, 'https://example.com/sports.jpg'),
('Book Club', 'A group for book lovers', 2, 'https://example.com/books.jpg'),
('Travel Lovers', 'A group for travel enthusiasts', 3, 'https://example.com/travel.jpg');

INSERT INTO groups_posts (user_id, group_id, content, image, created)
VALUES
(1, 1, "Hello group 1 from user 1!", NULL, '2022-04-15 09:00:00'),
(2, 1, "Hey everyone in group 1, user 2 here!", NULL, '2022-03-15 09:00:00'),
(1, 2, "Welcome to group 2!", NULL, '2022-01-15 09:00:00'),
(3, 2, "User 3 joining group 2", NULL, '2022-02-15 09:00:00'),
(2, 3, "Greetings from user 2 in group 3", NULL, '2022-05-15 09:00:00'),
(3, 3, "User 3 saying hi from group 3", NULL, '2022-06-15 09:00:00'),
(1, 1, "Another post from user 1 in group 1", NULL, '2022-07-15 09:00:00'),
(2, 2, "A post from user 2 in group 2", NULL, '2022-08-15 09:00:00'),
(3, 1, "User 3 posting in group 1", NULL, '2022-09-15 09:00:00'),
(1, 3, "User 1 posting in group 3", NULL, '2022-10-15 09:00:00');

INSERT INTO groups_comments (user_id, post_id, content, created) VALUES
(1, 1, "Great post, thanks for sharing!", '2022-10-15 09:00:00'),
(2, 1, "I totally agree with your points.", '2022-10-15 09:00:00'),
(3, 2, "This is really helpful, thanks for posting!", '2022-10-15 09:00:00'),
(1, 2, "I had a similar experience, thanks for sharing your story.", '2022-10-15 09:00:00'),
(2, 3, "This is a really interesting topic. I'd love to hear more about it.", '2022-10-15 09:00:00'),
(3, 3, "Thanks for sharing your insights!", '2022-10-15 09:00:00'),
(1, 3, "I think there are a lot of different perspectives on this issue, but I appreciate your take.", '2022-10-15 09:00:00'),
(2, 4, "Great post, I learned a lot!", '2022-10-15 09:00:00'),
(3, 4, "This is really informative, thanks for sharing your knowledge.", '2022-10-15 09:00:00'),
(1, 4, "I had no idea about this topic, thanks for bringing it to my attention.", '2022-10-15 09:00:00');

INSERT INTO groups_members (user_id, group_id, request_pending, invitation_pending) VALUES
(1, 1, false, false),
(2, 1, false, true),
(3, 1, true, false),
(2, 2, false, false),
(3, 2, false, true),
(1, 3, true, false),
(3, 3, false, false),
(1, 4, false, false),
(2, 4, true, false),
(3, 4, false, true);

INSERT INTO events (user_id, group_id, title, description, image, event_date) VALUES 
(1, 1, 'Charity Run', 'A charity run for local organizations', 'charity_run.jpg', '2023-04-15 09:00:00'),
(1, 2, 'Concert', 'A concert featuring local musicians', 'concert.jpg', '2023-05-01 20:00:00'),
(2, 1, 'Community Cleanup', 'A cleanup event for the local community', 'cleanup.jpg', '2023-05-15 10:00:00'),
(2, 2, 'Art Exhibition', 'An art exhibition featuring local artists', 'art_exhibition.jpg', '2023-06-01 18:00:00'),
(3, 1, 'Bake Sale', 'A bake sale to raise funds for charity', 'bake_sale.jpg', '2023-06-15 12:00:00'),
(3, 2, 'Movie Night', 'A movie night featuring classic films', 'movie_night.jpg', '2023-07-01 19:00:00');

INSERT INTO events_attendance (event_id, user_id, is_going) VALUES
(1, 1, true),
(1, 2, true),
(1, 3, false),
(2, 1, true),
(2, 3, true),
(3, 2, false),
(3, 3, true);

INSERT INTO messages (from_id, to_id, content, is_seen, created) VALUES
(1, 2, "Hi there!", 0, "2023-04-05 12:00:00"),
(2, 1, "Hello!", 1, "2023-04-05 12:01:00"),
(1, 3, "Hey, how's it going?", 0, "2023-04-05 12:02:00"),
(3, 1, "Pretty good, thanks for asking!", 0, "2023-04-05 12:03:00"),
(2, 3, "Long time no see!", 0, "2023-04-05 12:04:00"),
(3, 2, "Yeah, it's been a while!", 1, "2023-04-05 12:05:00");
