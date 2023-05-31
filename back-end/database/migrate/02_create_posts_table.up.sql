CREATE TABLE IF NOT EXISTS `posts`(
    `post_id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `user_id` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `image` TEXT,
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `is_almost_private` BOOLEAN NOT NULL DEFAULT FALSE,
    `selected_users` TEXT DEFAULT "",
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE
);