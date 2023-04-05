CREATE TABLE IF NOT EXISTS `posts`(
    `post_id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `user_id` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `image` TEXT,
    `is_public` BOOLEAN NOT NULL,
    `created` DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE
);