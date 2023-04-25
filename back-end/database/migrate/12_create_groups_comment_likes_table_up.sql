CREATE TABLE IF NOT EXISTS `groups_comment_likes`(
    `comment_id` INTEGER NOT NULL, 
    `user_id` INTEGER NOT NULL,  
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY(comment_id) REFERENCES groups_comments (comment_id) ON DELETE CASCADE,
	FOREIGN KEY(user_id) REFERENCES users (user_id) ON DELETE CASCADE
);