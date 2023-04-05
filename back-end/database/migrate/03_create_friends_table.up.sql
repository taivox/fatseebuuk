CREATE TABLE IF NOT EXISTS `friends`(
    `user_id` INTEGER PRIMARY KEY, --user who added the friend
    `friend_id` INTEGER NOT NULL,  --user that was added as a friend
    `request_pending` BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE
);

