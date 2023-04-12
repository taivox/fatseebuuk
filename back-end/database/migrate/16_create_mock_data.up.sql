INSERT INTO `users` (`first_name`, `last_name`, `nickname`, `date_of_birth`, `profile_image`, `cover_image`, `about`, `email`, `password`, `is_public`)
VALUES 
('Alice', 'Smith', 'alice_s', '1990-01-01', 'profile1.webp', 'cover1.jpg', 'I am a software engineer.', 'alice@example.com', 'password123', 1),
('Bob', 'Johnson', NULL, '1985-05-15', NULL, NULL, 'I love to travel and try new foods.', 'bob@example.com', 'secret456', 0),
('Charlie', 'Lee', 'charlie_lee', '1993-11-30', NULL, 'cover3.png', 'https://cdn.pixabay.com/photo/2021/06/29/08/07/twitter-cover-6373493_960_720.jpg', 'charlie@example.com', 'qwerty789', 1),
('asd', 'asdasd', 'asd_asd', '1990-01-01', 'chad.jpg', 'cover1.jpg', 'I am a software engineer.', 'asd@gmail.com', '$2a$04$uWKnKQRWxK6FmcacvDjNJuMXhsKZsvZ0GdkgqcemNfzXiHubA7hDW', 1),
('Chad', 'Smith', 'alice_s', '1990-01-01', 'dota.jpg', 'cover1.jpg', 'I am a software engineer.', 'qwe@gmail.com', '$2a$04$uWKnKQRWxK6FmcacvDjNJuMXhsKZsvZ0GdkgqcemNfzXiHubA7hDW', 1),
('Kopli', 'Liinid', 'kopli_l', '1990-01-01', 'peppa.jpg', 'cover3.jpg', 'I am a software engineer.', 'zxc@gmail.com', '$2a$04$uWKnKQRWxK6FmcacvDjNJuMXhsKZsvZ0GdkgqcemNfzXiHubA7hDW', 1);



INSERT INTO posts (user_id, content, image, created, is_public) VALUES
(1, 'This is my first post!', NULL, '2023-04-10 22:00:00', 1),
(1, 'Just hanging out with friends. #goodtimes', NULL, '2023-04-11 13:45:00', 1),
(2, 'Trying out this new recipe I found. #yum', NULL, '2023-04-11 08:30:00', 0),
(2, 'I cant believe its already fall! 🍂', NULL, '2023-04-11 17:15:00', 1),
(3, 'Excited to start my new job!', NULL, '2023-04-11 09:00:00', 1),
(3, 'Weekend getaway with the family. #familytime', NULL, '2023-04-11 19:45:00', 1),
(3, 'Excited to start my new job!', NULL, '2023-04-11 14:30:00', 1),
(4, 'Weekend getaway ma olen asdasd public post pildiga ', 'js.jpg', '2023-04-11 08:15:00', 1),
(4, 'Excited to start ma olen asdasd public post ', NULL, '2023-04-11 20:00:00', 1),
(4, 'Weekend getaway ma olen asdasd private post pildiga ', 'flowers.jpg', '2023-04-11 09:45:00', 0),
(5, 'Weekend getaway chadsmith public post ', NULL, '2023-04-11 17:30:00', 1),
(5, 'Excited to start chadsmith public post sellel pole commenteid ', NULL, '2023-04-11 08:15:00', 1),
(5, 'Weekend getaway chadsmith private post pildiga', 'nagutaivo.png', '2023-04-11 19:00:00', 0),
(6, 'Excited to start koplilliinbid public post pildiga ', 'chadpost.png', '2023-04-11 14:30:00', 1),
(6, 'Weekend kopliliinidgetaway public post ', NULL, '2023-04-11 07:15:00', 1),
(6, 'Weekend kopliliinidgetaway private post ', NULL, '2023-03-11 18:00:00', 0);


INSERT INTO `friends` (`user_id`, `friend_id`, `request_pending`)
VALUES
(1, 2, 0),
(1, 3, 1),
(2, 1, 0),
(2, 3, 0),
(3, 1, 0),
(3, 2, 1),
(4, 5, 0),
(4, 6, 0),
(5, 6, 0);


INSERT INTO comments (user_id, post_id, content, created)
VALUES
(1, 1, 'Great post!', '2023-04-10 15:30:00'),
(2, 1, 'I agree, this is really helpful.', '2023-04-10 16:15:00'),
(3, 1, 'Thanks for sharing!', '2023-04-10 17:20:00'),
(2, 2, 'Awesome photo!', '2023-04-09 13:45:00'),
(1, 3, 'I had a similar experience.', '2023-04-09 16:00:00'),
(3, 4, 'This is hilarious!', '2023-04-08 10:30:00'),
(1, 4, 'I love this meme.', '2023-04-08 12:00:00'),
(3, 4, 'LOL!', '2023-04-08 12:30:00'),
(1, 5, 'Interesting article.', '2023-04-07 18:45:00'),
(2, 6, 'I like the way you presented this.', '2023-04-06 11:15:00'),
(1, 6, 'This is very informative.', '2023-04-06 12:30:00'),
(2, 8, 'I like the way you presented this.', '2023-04-11 10:15:00'),
(2, 8, 'I like the way you presented this.', '2023-04-11 11:30:00'),
(2, 8, 'I like the way you presented this.', '2023-04-11 12:45:00'),
(2, 9, 'I like the way you presented this.', '2023-04-11 13:00:00'),
(2, 9, 'I like the way you presented this.', '2023-04-11 14:15:00'),
(2, 9, 'I like the way you presented this.', '2023-04-11 15:30:00'),
(4, 10, 'neljanda useri comment 10ndale postile.', '2023-04-11 16:45:00'),
(5, 10, 'viienda useri comment 10ndale postile', '2023-04-11 17:00:00'),
(6, 10, 'kuuenda useri comment 10ndale postile.', '2023-04-11 18:15:00'),
(4, 11, 'neljanda useri comment 11ndale postile.', '2023-04-11 19:30:00'),
(5, 11, 'viienda useri comment 11ndale postile.', '2023-04-11 20:45:00'),
(6, 11, 'kuuenda useri comment 11ndale postile.', '2023-04-11 21:00:00'),
(4, 13, 'neljanda useri comment 13ndale postile', '2023-04-11 22:15:00'),
(5, 13, 'viienda useri comment 13ndale postile', '2023-04-11 22:30:00'),
(6, 13, 'kuuenda useri comment 13ndalepostile', '2023-04-11 21:45:00'),
(4, 14, 'neljanda useri comment 14ndalepostile', '2023-04-11 20:45:00'),
(5, 14, 'viienda useri comment 14ndalepostile', '2023-04-11 19:45:00'),
(6, 14, 'kuuenda useri comment 14ndalepostile ', '2023-04-11 18:45:00'),
(4, 15, 'I like the way you presented this', '2023-04-11 17:45:00'),
(5, 15, 'I like the way you presented this.', '2023-04-11 10:45:00'),
(6, 15, 'I like the way you presented this.', '2023-04-11 11:45:00'),
(4, 16, 'I like the way you presented this.', '2023-04-11 12:45:00'),
(5, 16, 'I like the way you presented this.', '2023-04-11 13:45:00'),
(6, 16, 'I like the way you presented this.', '2023-04-11 15:45:00');



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
(6, 1),
(8, 2),
(8, 3),
(8, 4),
(8, 5),
(8, 6),
(9, 1),
(9, 2),
(9, 3),
(10, 4),
(10, 5),
(10, 6),
(12, 1),
(12, 2),
(12, 3),
(13, 4),
(13, 5);


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
(21, 3),
(21, 4),
(21, 5),
(21, 6),
(22, 1),
(22, 2),
(22, 3),
(22, 4),
(22, 5),
(22, 6),
(23, 3);


INSERT INTO groups (title, description, user_id, image) VALUES
('Sports Fans', 'A group for sports enthusiasts', 1, NULL),
('Book Club', 'A group for book lovers', 2, NULL),
('Travel Lovers', 'A group for travel enthusiasts', 3, NULL);

INSERT INTO groups_posts (user_id, group_id, content, image, created)
VALUES
(1, 1, "Hello group 1 from user 1!Hello group 1 from user 1!Hello group 1 from user 1!Hello group 1 from user 1!Hello group 1 from user 1!Hello group 1 from user 1!Hello group 1 from user 1!Hello group 1 from user 1!Hello group 1 from user 1!Hello group 1 from user 1!Hello group 1 from user 1!Hello group 1 from user 1!Hello group 1 from user 1!Hello group 1 from user 1!Hello group 1 from user 1!", 'seepic.png', '2022-04-15 09:00:00'),
(2, 1, "Hey everyone in group 1, user 2 here!", 'js.jpg', '2022-03-15 09:00:00'),
(1, 2, "Welcome to group 2!", NULL, '2022-01-15 09:00:00'),
(3, 2, "User 3 joining group 2", 'js.jpg', '2022-02-15 09:00:00'),
(2, 3, "Greetings from user 2 in group 3", 'seepic.png', '2022-05-15 09:00:00'),
(3, 3, "User 3 saying hi from group 3", NULL, '2022-06-15 09:00:00'),
(1, 1, "Another post from user 1 in group 1", 'js.jpg', '2022-07-15 09:00:00'),
(2, 2, "A post from user 2 in group 2", 'seepic.png', '2022-08-15 09:00:00'),
(3, 1, "User 3 posting in group 1", 'js.jpg', '2022-09-15 09:00:00'),
(1, 3, "User 1 posting in group 3", NULL, '2022-10-15 09:00:00');

INSERT INTO groups_comments (user_id, post_id, content, created) VALUES
(1, 1, "Great post, thanks for sharing!", '2022-10-15 09:00:00'),
(2, 1, "I totally agree with your points.I totally agree with your points.I totally agree with your points.I totally agree with your points.I totally agree with your points.I totally agree with your points.I totally agree with your points.I totally agree with your points.I totally agree with your points.I totally agree with your points.I totally agree with your points.I totally agree with your points.I totally agree with your points.", '2022-10-15 09:00:00'),
(3, 2, "This is really helpful, thanks for posting!", '2022-10-15 09:00:00'),
(1, 2, "I had a similar experience, thanks for sharing your story.", '2022-10-15 09:00:00'),
(2, 3, "This is a really interesting topic. I'd love to hear more about it.", '2022-10-15 09:00:00'),
(3, 3, "Thanks for sharing your insights!", '2022-10-15 09:00:00'),
(1, 3, "I think there are a lot of different perspectives on this issue, but I appreciate your take.", '2022-10-15 09:00:00'),
(2, 4, "Great post, I learned a lot!", '2022-10-15 09:00:00'),
(3, 4, "This is really informative, thanks for sharing your knowledge.", '2022-10-15 09:00:00'),
(1, 4, "I had no idea about this topic, thanks for bringing it to my attention.", '2022-10-15 09:00:00');

INSERT INTO groups_members (user_id, group_id, request_pending, invitation_pending) VALUES
(1, 1, 0, 0),
(2, 1, 0, 1),
(3, 1, 1, 0),
(2, 2, 0, 0),
(3, 2, 0, 1),
(1, 3, 1, 0),
(3, 3, 0, 0),
(1, 4, 0, 0),
(4, 1, 0, 0),
(3, 4, 0, 1);

INSERT INTO events (user_id, group_id, title, description, image, event_date) VALUES 
(1, 1, 'Charity Run', 'A charity run for local organizations', NULL, '2022-04-15 09:00:00'),
(1, 1, 'Concert', 'A concert featuring local musicians', 'flowers.jpg', '2022-05-01 20:00:00'),
(2, 1, 'Community Cleanup', 'A cleanup event for the local community', 'guys.webp', '2022-05-15 10:00:00'),
(2, 1, 'Art Exhibition', 'An art exhibition featuring local artists', NULL, '2023-06-01 18:00:00'),
(3, 1, 'Bake Sale', 'A bake sale to raise funds for charity', 'guys.webp', '2023-06-15 12:00:00'),
(3, 1, 'Movie Night', 'A movie night featuring classic films', 'flowers.jpg', '2023-07-01 19:00:00'),
(2, 2, 'teise grupi event', 'A movie teise grupi event teiselt userilt films', 'flowers.jpg', '2023-07-01 19:00:00');


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
