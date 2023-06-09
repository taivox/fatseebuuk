CREATE TABLE IF NOT EXISTS `groups_posts`(
    `post_id` INTEGER PRIMARY KEY AUTOINCREMENT, 
    `user_id` INTEGER NOT NULL,  
    `group_id` INTEGER NOT NULL,
    `content` TEXT NOT NULL, 
    `image` TEXT,
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE
);

