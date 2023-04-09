CREATE TABLE IF NOT EXISTS `users`(
    `user_id`      INTEGER PRIMARY KEY AUTOINCREMENT,
    `first_name` TEXT NOT NULL,
    `last_name` TEXT NOT NULL,
    `nickname` TEXT,
    `date_of_birth` DATE NOT NULL,
    `profile_image` TEXT,
    `cover_image` TEXT,
    `about` TEXT,
    `email`       TEXT UNIQUE NOT NULL,
    `password`    TEXT        NOT NULL,
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP, 
    `is_public` BOOLEAN NOT NULL
);