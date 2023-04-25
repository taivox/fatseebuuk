CREATE TABLE IF NOT EXISTS `groups_post_likes`(
    `post_id` INTEGER NOT NULL, 
    `user_id` INTEGER NOT NULL,  
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY(post_id) REFERENCES groups_posts (post_id) ON DELETE CASCADE,
	FOREIGN KEY(user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

