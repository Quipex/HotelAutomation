-- noinspection SqlResolveForFile

-- Update notification table to support enum status types

-- First create a type for the notification status
DO
$$
  BEGIN
    IF NOT EXISTS(SELECT 1 FROM pg_type WHERE typname = 'notification_status') THEN
      CREATE TYPE notification_status AS ENUM ('SENT', 'FAILED');
    END IF;
  END
$$;

-- Update existing records to match the new enum values
UPDATE notification
SET status = 'SENT'
WHERE UPPER(status) = 'SENT'
   OR UPPER(status) = 'SUCCESS';
UPDATE notification
SET status = 'FAILED'
WHERE status IS NULL
   OR UPPER(status) != 'SENT';

-- Alter the column to use the new type
ALTER TABLE notification
  ALTER COLUMN status TYPE notification_status USING status::notification_status;

-- Make the status column NOT NULL
ALTER TABLE notification
  ALTER COLUMN status SET NOT NULL;

-- Add index on status to improve query performance
CREATE INDEX idx_notification_status ON notification (status);
