CREATE TABLE IF NOT EXISTS `sessions`(
    `user_id` INTEGER NOT NULL, 
    `session_token` TEXT NOT NULL,  
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE
);

