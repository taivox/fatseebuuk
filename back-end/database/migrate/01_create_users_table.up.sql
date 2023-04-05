CREATE TABLE IF NOT EXISTS `users`(
    `user_id`      INTEGER PRIMARY KEY AUTOINCREMENT,
    `first_name` TEXT NOT NULL,
    `last_name` TEXT NOT NULL,
    `nickname` TEXT,
    `date_of_birth` DATE NOT NULL,
    `profile_picture` TEXT,
    `about` TEXT,
    `email`       TEXT UNIQUE NOT NULL,
    `password`    TEXT        NOT NULL,
    `created`     DATE        NOT NULL
);