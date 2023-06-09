CREATE TABLE IF NOT EXISTS `groups_comments`(
    `comment_id` INTEGER PRIMARY KEY AUTOINCREMENT, 
    `user_id` INTEGER NOT NULL,  
    `post_id` INTEGER NOT NULL,
    `content` TEXT NOT NULL, 
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    FOREIGN KEY (post_id) REFERENCES groups_posts (post_id)
    ON DELETE CASCADE
);

