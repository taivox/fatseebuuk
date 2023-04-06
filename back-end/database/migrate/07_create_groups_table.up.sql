CREATE TABLE IF NOT EXISTS `groups`(
    `group_id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `title` TEXT NOT NULL, 
    `description` TEXT NOT NULL,  
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    `user_id` INTEGER NOT NULL,
    `image` TEXT NOT NULL
);