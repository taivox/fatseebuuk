CREATE TABLE IF NOT EXISTS `notifications`(
    `notification_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
    `to_id` INTEGER NOT NULL,  
    `from_id` INTEGER NOT NULL,  
    `notification_type` TEXT NOT NULL,  
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP
);
