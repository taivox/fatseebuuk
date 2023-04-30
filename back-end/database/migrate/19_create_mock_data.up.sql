INSERT INTO `users` (`first_name`, `last_name`, `nickname`, `date_of_birth`, `profile_image`, `cover_image`, `about`, `email`, `password`, `is_public`)
VALUES 
('Alice', 'Smith', 'alice_s', '1990-01-01', 'profile1.webp', 'cover1.jpg', 'I am a software engineer.', 'alice@gmail.com', '$2a$04$uWKnKQRWxK6FmcacvDjNJuMXhsKZsvZ0GdkgqcemNfzXiHubA7hDW', 1),
('Bob', 'Johnson', 'bob_j', '1985-05-15', NULL, 'mustache.jpg', 'I love to travel and try new foods.', 'bob@gmail.com', '$2a$04$uWKnKQRWxK6FmcacvDjNJuMXhsKZsvZ0GdkgqcemNfzXiHubA7hDW', 0),
('Charlie', 'Lee', 'charlie_lee', '1993-11-30', NULL, 'productman.jpg', 'I love to travel and try new foods.', 'charlie@gmail.com', '$2a$04$uWKnKQRWxK6FmcacvDjNJuMXhsKZsvZ0GdkgqcemNfzXiHubA7hDW', 1),
('Asd', 'Asdasd', 'asd_asd', '1990-01-01', 'chad.jpg', 'cover1.jpg', 'I am a software engineer.', 'asd@gmail.com', '$2a$04$uWKnKQRWxK6FmcacvDjNJuMXhsKZsvZ0GdkgqcemNfzXiHubA7hDW', 1),
('Chad', 'Smith', 'alice_s', '1990-01-01', 'dota.jpg', 'cover1.jpg', 'I am a software engineer.', 'chad@gmail.com', '$2a$04$uWKnKQRWxK6FmcacvDjNJuMXhsKZsvZ0GdkgqcemNfzXiHubA7hDW', 1),
('Kopli', 'Liinid', 'kopli_l', '1990-01-01', 'peppa.jpg', NULL, 'I am a software engineer.', 'kopli@gmail.com', '$2a$04$uWKnKQRWxK6FmcacvDjNJuMXhsKZsvZ0GdkgqcemNfzXiHubA7hDW', 1),
('John', 'Doe', 'john_doe', '1992-03-17', 'scumbag.jpg', NULL, 'I am a student.', 'john@gmail.com', '$2a$04$uWKnKQRWxK6FmcacvDjNJuMXhsKZsvZ0GdkgqcemNfzXiHubA7hDW', 1),
('Jane', 'Doe', 'jane_doe', '1995-07-02', 'tom.webp', NULL, 'I am a teacher.', 'jane@gmail.com','$2a$04$uWKnKQRWxK6FmcacvDjNJuMXhsKZsvZ0GdkgqcemNfzXiHubA7hDW', 1);



INSERT INTO posts (user_id, content, image, created) VALUES
(1, 'Just finished reading a great book. Highly recommend!', 'chadpost.png', '2023-04-20 09:30:00'),
(1, 'Missing the beach already... #tbt', 'flowers.jpg', '2023-04-25 14:15:00'),
(1, 'Cant wait to travel again. Where should I go next?', NULL, '2023-04-28 16:45:00'),
(1, 'Trying out a new recipe today. Fingers crossed!', NULL, '2023-04-30 11:00:00'),
(1, 'Just got back from a weekend hiking trip. Feeling refreshed!', 'js.jpg', '2023-05-03 18:30:00'),
(1, 'Excited to announce that Im starting a new job next week!', NULL, '2023-05-05 10:00:00'),
(1, 'Feeling grateful for the friends and family in my life. #blessed', 'flowers.jpg', '2023-05-07 14:45:00'),
(1, 'Taking a break from social media for a few days. See you soon!', NULL, '2023-05-10 09:00:00'),
(1, 'Just adopted a new puppy! Say hello to Charlie', 'chadpost.png', '2023-05-12 16:15:00'),
(1, 'Spent the day exploring a new city. Cant wait to come back!', 'guys.webp', '2023-05-15 13:00:00'),
(2, 'Had a great time hiking in the mountains this weekend. #naturelover', 'guys.webp', '2023-04-16 11:00:00'),
(2, 'Trying to learn a new language. Any tips?', NULL, '2023-04-22 16:45:00'),
(3, 'Just got back from an amazing trip to Japan. The food was incredible!', 'js.jpg', '2023-04-18 08:30:00'),
(3, 'Excited to start working on a new project at work!','nagutaivo.png', '2023-04-24 12:15:00'),
(4, 'Check out this amazing view from my apartment!', 'seepic.png', '2023-04-19 19:30:00'),
(4, 'Just tried a new recipe and it turned out great. Who wants to come over for dinner?', 'oldprogrammers.webp', '2023-04-23 10:45:00'),
(5, 'Just finished a great workout. Feeling pumped!', 'chadpost.png', '2023-04-21 15:00:00'),
(5, 'Cant wait to see the new Marvel movie this weekend. Who else is excited?', NULL, '2023-04-26 18:30:00'),
(6, 'Working on a new coding project. Its challenging, but Im excited to learn more!', 'seepic.png', '2023-04-17 12:00:00'),
(6, 'Just started a new book. So far, its really interesting!', NULL, '2023-04-27 09:15:00'),
(7, 'Just finished a big project for school. Time for a break!', 'guys.webp', '2023-04-15 16:30:00'),
(7, 'Trying to decide what to do this weekend. Any suggestions?', NULL, '2023-04-20 21:45:00'),
(8, 'Just finished a great workout. Feeling energized!', 'chadpost.png', '2023-04-14 08:00:00'),
(8, 'Excited to start teaching a new class next week!', 'js.jpg', '2023-04-26 13:00:00');



INSERT INTO `friends` (`user_id`, `friend_id`, `request_pending`)
VALUES
(1, 2, 0),
(1, 3, 0),
(1, 4, 0),
(1, 5, 0),
(1, 6, 0),
(1, 7, 0),
(1, 8, 0),
(2, 3, 0),
(2, 4, 0),
(2, 5, 0),
(2, 6, 0),
(2, 7, 0),
(2, 8, 0),
(3, 4, 0),
(3, 5, 0),
(3, 6, 0),
(3, 7, 0),
(3, 8, 0),
(4, 5, 0),
(4, 6, 0),
(4, 7, 0),
(4, 8, 0);

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
(4, 6, 'Wow, stunning view!', '2023-04-26 08:00:00'),
(2, 6, 'I wish I could be there right now.', '2023-04-26 10:30:00'),
(3, 7, 'This looks delicious! Can you share the recipe?', '2023-04-25 14:00:00'),
(5, 7, 'I love pasta, definitely going to try this recipe!', '2023-04-25 16:30:00'),
(1, 8, 'I cant believe its been a year already. Miss you!', '2023-04-24 09:15:00'),
(6, 8, 'Time flies, doesnt it? We should catch up soon!', '2023-04-24 11:00:00'),
(7, 9, 'Thats a great quote. Thanks for sharing!', '2023-04-23 16:00:00'),
(8, 10, 'I agree, its important to take breaks and recharge.', '2023-04-22 11:30:00'),
(2, 11, 'This is so cute!', '2023-04-21 14:00:00'),
(3, 11, 'Aww, I want a puppy too!', '2023-04-21 15:00:00');



INSERT INTO `post_likes` (`post_id`, `user_id`)
VALUES
(1, 2),
(1, 3),
(1, 4),
(1, 1),
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
(6, 1);


INSERT INTO groups (title, description, user_id, image) VALUES
('Sports Fans', 'A group for sports enthusiasts', 5, 'cover1.jpg'),
('Book Club', 'A group for book lovers', 2, 'mustache.jpg'),
('Travel Lovers', 'A group for travel enthusiasts', 3, NULL);

INSERT INTO groups_posts (user_id, group_id, content, image, created)
VALUES
(1,1, "Just finished my morning jog! It's a beautiful day outside", 'chadpost.png', '2023-04-30 08:00:00'),
(2,1, "I'm excited to start my new job next week", NULL, '2023-04-29 10:30:00'),
(3,1, "Had an amazing sushi dinner last night with friends", 'js.jpg', '2023-04-28 19:45:00'),
(4,2, "Can't wait for summer vacation!", NULL, '2023-04-27 14:00:00'),
(5,2, "I started learning a new language, wish me luck!", NULL, '2023-04-26 11:15:00'),
(6,2, "Finally finished reading that book I've been putting off for months", 'seepic.png', '2023-04-25 16:20:00'),
(7,1, "Trying out a new recipe for dinner tonight, hope it turns out well", 'oldprogrammers.webp', '2023-04-24 18:30:00'),
(8,1, "I miss my family back home, can't wait to see them soon", NULL, '2023-04-23 12:45:00'),
(1,1, "Just got back from an amazing trip to Hawaii!", 'nagutaivo.png', '2023-04-22 09:00:00'),
(2,2, "I can't believe it's already Friday! This week flew by", NULL, '2023-04-21 13:15:00');

INSERT INTO groups_comments (user_id, post_id, content, created) VALUES
(1, 1, "Great post! I really enjoyed reading it and learned a lot from your insights.", '2022-10-15 09:00:00'),
(2, 1, "I completely agree with you. Your points are very well-argued and I think this is an important topic to discuss.", '2022-10-15 09:00:00'),
(3, 2, "Thanks for sharing your experience. It's helpful to hear about how others have dealt with similar situations.", '2022-10-15 09:00:00'),
(1, 2, "I appreciate your honesty and vulnerability in sharing your story. It's important to talk about these issues and raise awareness.", '2022-10-15 09:00:00'),
(2, 3, "This is a really interesting topic and I appreciate you bringing it up. I think there are a lot of different perspectives to consider.", '2022-10-15 09:00:00'),
(3, 3, "Thanks for sharing your insights. I learned a lot from reading your post.", '2022-10-15 09:00:00'),
(1, 3, "I agree that there are different perspectives on this issue. It's important to consider all sides and have an open-minded discussion.", '2022-10-15 09:00:00'),
(2, 4, "Wow, I had no idea about this topic. Thank you for sharing your knowledge and shedding light on this important issue.", '2022-10-15 09:00:00'),
(3, 4, "I learned so much from reading your post. Your insights are very valuable and I appreciate you sharing them with us.", '2022-10-15 09:00:00'),
(1, 4, "Thanks for bringing this topic to my attention. It's important to be aware of these issues and I appreciate you sharing your thoughts on it.", '2022-10-15 09:00:00');

INSERT INTO groups_members (user_id, group_id, request_pending, invitation_pending) VALUES
(4, 1, 0, 0),
(2, 1, 0, 1),
(3, 1, 0, 0),
(2, 2, 0, 0),
(3, 2, 0, 1),
(1, 2, 0, 0),
(3, 3, 0, 0),
(5, 1, 0, 0),
(2, 2, 0, 0),
(3, 3, 0, 0);


INSERT INTO `groups_post_likes` (`post_id`, `user_id`)
VALUES
(2, 1),
(2, 2),
(2, 3);



INSERT INTO `groups_comment_likes` (`comment_id`, `user_id`) VALUES 
(3, 1),
(3, 2),
(3, 3);


INSERT INTO events (user_id, group_id, title, description, image, event_date) VALUES 
(1, 1, 'Charity Run', 'A charity run for local organizations', NULL, '2022-04-15 09:00:00'),
(1, 1, 'Concert', 'A concert featuring local musicians', 'flowers.jpg', '2022-05-01 20:00:00'),
(2, 1, 'Community Cleanup', 'A cleanup event for the local community', 'guys.webp', '2022-05-15 10:00:00'),
(2, 1, 'Art Exhibition', 'An art exhibition featuring local artists', NULL, '2023-06-01 18:00:00'),
(3, 1, 'Bake Sale', 'A bake sale to raise funds for charity', 'guys.webp', '2023-06-15 12:00:00'),
(3, 1, 'Movie Night', 'A movie night featuring classic films', 'flowers.jpg', '2023-07-01 19:00:00'),
(2, 2, 'Another movie night', 'A movie night', 'flowers.jpg', '2023-07-01 19:00:00');


INSERT INTO events_attendance (event_id, user_id, is_going) VALUES
(1, 1, true),
(1, 2, true),
(1, 3, false),
(2, 1, true),
(2, 3, true),
(3, 2, false),
(3, 3, true);

INSERT INTO messages (from_id, to_id, content, created) VALUES
(1, 2, "Hi there!", "2023-04-05 12:00:00"),
(2, 1, "Hello!", "2023-04-05 12:01:00"),
(1, 3, "Hey, how's it going?", "2023-04-05 12:02:00"),
(3, 1, "Pretty good, thanks for asking!", "2023-04-05 12:03:00"),
(2, 3, "Long time no see!", "2023-04-05 12:04:00"),
(3, 2, "Yeah, it's been a while!", "2023-04-05 12:05:00"),
(4, 2, "Hi there!", "2023-04-05 12:00:00"),
(2, 4, "Hello!", "2023-04-05 12:01:00"),
(4, 4, "Hey, how's it going?", "2023-04-05 12:02:00"),
(3, 4, "Pretty good, thanks for asking!", "2023-04-05 12:03:00"),
(4, 3, "Long time no see!", "2023-04-05 12:04:00"),
(3, 4, "Yeah, it's been a while!", "2023-04-05 12:05:00");


INSERT INTO groups_messages (from_id, group_id, content, created) VALUES
(1, 1, "Hi there!", "2023-04-05 12:00:00"),
(2, 1, "Hello!", "2023-04-05 12:01:00"),
(3, 1, "Hey, how's it going?", "2023-04-05 12:02:00"),
(4, 1, "Pretty good, thanks for asking", "2023-04-05 12:03:00"),
(1, 1, "Long time no see!", "2023-04-05 12:04:00"),
(2, 1, "Yeah, it's been a while!", "2023-04-05 12:05:00"),
(3, 1, "Hi there!", "2023-04-05 12:00:00"),
(4, 1, "Hello!", "2023-04-05 12:01:00"),
(1, 1, "Hey, how's it going?", "2023-04-05 12:02:00"),
(2, 1, "Pretty good, thanks for asking!", "2023-04-05 12:03:00"),
(3, 1, "Long time no see!", "2023-04-05 12:04:00"),
(4, 1, "Yeah, it's been a while!", "2023-04-05 12:05:00");




