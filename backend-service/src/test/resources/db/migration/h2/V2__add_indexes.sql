-- Simplified indexes for H2 testing

-- Client table indexes
CREATE INDEX idx_client_full_name_simple ON client (full_name);
-- B-tree index on email (case-insensitive)
CREATE INDEX idx_client_email_lower ON client (email);

-- Booking table indexes
-- B-tree indexes on checkin and checkout dates for range queries
CREATE INDEX idx_booking_checkin_date ON booking (checkin_date);
CREATE INDEX idx_booking_checkout_date ON booking (checkout_date);

-- Audit log index
-- B-tree index on actor_id for fast lookup of actions by actor
CREATE INDEX idx_audit_log_actor_id ON audit_log (actor_id);

-- Notification indexes
-- B-tree indexes on created_at and status for notification queries
CREATE INDEX idx_notification_created_at ON notification (created_at);
CREATE INDEX idx_notification_status ON notification (status);

-- Payment indexes
-- B-tree indexes on booking_id and paid_at for payment queries
CREATE INDEX idx_payment_booking_id ON payment (booking_id);
CREATE INDEX idx_payment_paid_at ON payment (paid_at); 