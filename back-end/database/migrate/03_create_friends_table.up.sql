CREATE TABLE IF NOT EXISTS `friends`(
    `user_id` INTEGER NOT NULL,
    `friend_id` INTEGER NOT NULL,
    `request_pending` BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE
);

