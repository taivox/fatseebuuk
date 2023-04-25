CREATE TABLE IF NOT EXISTS `events_attendance`(
    `event_id` INTEGER, 
    `user_id` INTEGER NOT NULL,  
    `is_going` BOOLEAN NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    FOREIGN KEY (event_id) REFERENCES events (event_id)
    ON DELETE CASCADE
);

