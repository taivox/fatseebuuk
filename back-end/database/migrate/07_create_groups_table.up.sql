CREATE TABLE IF NOT EXISTS `groups`(
    `group_id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `title` TEXT NOT NULL, 
    `description` TEXT NOT NULL,  
    `created_at` DATETIME NOT NULL,
    `user_id` INTEGER NOT NULL,
    `image` TEXT NOT NULL,
);