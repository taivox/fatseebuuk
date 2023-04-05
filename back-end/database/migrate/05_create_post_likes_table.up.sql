CREATE TABLE IF NOT EXISTS `post_likes`(
    `post_id` INTEGER NOT NULL, 
    `user_id` INTEGER NOT NULL,  
    `created_at` DATETIME NOT NULL,
    FOREIGN KEY(post_id) REFERENCES posts (post_id) ON DELETE CASCADE,
	FOREIGN KEY(user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

