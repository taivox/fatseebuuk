CREATE TABLE IF NOT EXISTS `groups_members`(
    `groups_members_id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `user_id` INTEGER NOT NULL, 
    `group_id` INTEGER NOT NULL,
    `request_pending` BOOLEAN NOT NULL,
    `invitation_pending` BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE
);

