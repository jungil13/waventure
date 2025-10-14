-- Add soft delete functionality to bookings table
-- This migration adds columns to support soft delete and booking history

-- Add soft delete columns to bookings table
ALTER TABLE `bookings` 
ADD COLUMN `is_deleted` TINYINT(1) DEFAULT 0 COMMENT 'Soft delete flag: 0 = active, 1 = deleted',
ADD COLUMN `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Timestamp when booking was soft deleted',
ADD COLUMN `deleted_by` INT(11) NULL DEFAULT NULL COMMENT 'User ID who deleted the booking',
ADD COLUMN `deletion_reason` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Reason for deletion';

-- Add indexes for better performance
ALTER TABLE `bookings` 
ADD INDEX `idx_is_deleted` (`is_deleted`),
ADD INDEX `idx_deleted_at` (`deleted_at`),
ADD INDEX `idx_user_deleted` (`user_id`, `is_deleted`);

-- Create booking_history table to track all booking changes
CREATE TABLE `booking_history` (
  `history_id` INT(11) NOT NULL AUTO_INCREMENT,
  `booking_id` INT(11) NOT NULL,
  `action` ENUM('created', 'updated', 'deleted', 'restored', 'status_changed', 'payment_updated') NOT NULL,
  `old_values` JSON NULL DEFAULT NULL COMMENT 'Previous values before change',
  `new_values` JSON NULL DEFAULT NULL COMMENT 'New values after change',
  `changed_by` INT(11) NULL DEFAULT NULL COMMENT 'User ID who made the change',
  `change_reason` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Reason for the change',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`history_id`),
  INDEX `idx_booking_id` (`booking_id`),
  INDEX `idx_action` (`action`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_changed_by` (`changed_by`),
  FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`booking_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tracks all changes to bookings for audit trail';
