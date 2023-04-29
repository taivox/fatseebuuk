CREATE TABLE IF NOT EXISTS `groups_messages`(
    `message_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
    `from_id` INTEGER NOT NULL,  
    `group_id` INTEGER NOT NULL,  
    `content` TEXT NOT NULL, 
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP
);

