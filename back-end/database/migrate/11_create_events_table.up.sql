CREATE TABLE IF NOT EXISTS `events`(
    `event_id` INTEGER PRIMARY KEY AUTOINCREMENT, 
    `user_id` INTEGER NOT NULL,  
    `group_id` INTEGER NOT NULL,
    `title` TEXT NOT NULL, 
    `description` TEXT NOT NULL, 
    `image` TEXT,
    `event_date` DATETIME NOT NULL,
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE
);

