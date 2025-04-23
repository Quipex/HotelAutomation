-- Test data for unit tests

-- Insert test rooms
INSERT INTO room (id, number, floor, has_sea_view, balcony_side, type, max_adults, capacity, notes)
VALUES 
('f47ac10b-58cc-4372-a567-0e02b2c3d479', '101', 1, true, 'East', 'Standard', 2, 2, 'Test room 101'),
('f47ac10b-58cc-4372-a567-0e02b2c3d480', '102', 1, true, 'East', 'Standard', 2, 3, 'Test room 102'),
('f47ac10b-58cc-4372-a567-0e02b2c3d481', '201', 2, false, 'West', 'Deluxe', 3, 4, 'Test room 201'),
('f47ac10b-58cc-4372-a567-0e02b2c3d482', '202', 2, false, 'West', 'Deluxe', 3, 4, 'Test room 202'),
('f47ac10b-58cc-4372-a567-0e02b2c3d483', '301', 3, true, 'South', 'Suite', 4, 6, 'Test room 301');

-- Insert test clients
INSERT INTO client (id, first_name, last_name, middle_name, full_name, phones, email, notes, created_at, updated_at)
VALUES 
('a47ac10b-58cc-4372-a567-0e02b2c3d479', 'John', 'Doe', '', 'John Doe', '123-456-7890', 'john.doe@example.com', 'Test client 1', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('a47ac10b-58cc-4372-a567-0e02b2c3d480', 'Jane', 'Smith', '', 'Jane Smith', '234-567-8901', 'jane.smith@example.com', 'Test client 2', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('a47ac10b-58cc-4372-a567-0e02b2c3d481', 'Bob', 'Johnson', '', 'Bob Johnson', '345-678-9012', 'bob.johnson@example.com', 'Test client 3', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert test bookings
INSERT INTO booking (id, client_id, room_id, checkin_date, checkout_date, status, source, cost, notes, created_at, updated_at)
VALUES 
('b47ac10b-58cc-4372-a567-0e02b2c3d479', 'a47ac10b-58cc-4372-a567-0e02b2c3d479', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 
 CURRENT_DATE + 1, CURRENT_DATE + 4, 'PENDING_PAYMENT', 'WEBSITE', 450.00, 'Test booking 1', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('b47ac10b-58cc-4372-a567-0e02b2c3d480', 'a47ac10b-58cc-4372-a567-0e02b2c3d480', 'f47ac10b-58cc-4372-a567-0e02b2c3d480', 
 CURRENT_DATE + 5, CURRENT_DATE + 8, 'PAID', 'PHONE', 600.00, 'Test booking 2', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('b47ac10b-58cc-4372-a567-0e02b2c3d481', 'a47ac10b-58cc-4372-a567-0e02b2c3d481', 'f47ac10b-58cc-4372-a567-0e02b2c3d481', 
 CURRENT_DATE + 10, CURRENT_DATE + 15, 'PAID', 'WEBSITE', 1250.00, 'Test booking 3', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert test booking history
INSERT INTO booking_history (booking_id, field, old_value, new_value, timestamp)
VALUES 
('b47ac10b-58cc-4372-a567-0e02b2c3d479', 'status', 'PENDING_PAYMENT', 'PAID', CURRENT_TIMESTAMP()),
('b47ac10b-58cc-4372-a567-0e02b2c3d480', 'notes', 'Initial notes', 'Test booking 2', CURRENT_TIMESTAMP());

-- Insert test sync status
INSERT INTO sync_status (last_sync_at, status, duration, details)
VALUES 
(DATEADD('HOUR', -1, CURRENT_TIMESTAMP()), 'SUCCESS', 1500, 'Test sync successful');

-- Insert test audit actors
INSERT INTO audit_actor (platform, user_id, user_name, user_nick, ip_address, created_at)
VALUES
('TEST', 'test-user', 'Test User', 'tester', '127.0.0.1', CURRENT_TIMESTAMP());

-- Insert test audit logs
INSERT INTO audit_log (timestamp, actor_id, action, object_type, object_id, details)
VALUES
(CURRENT_TIMESTAMP(), 1, 'CREATE', 'BOOKING', 'b47ac10b-58cc-4372-a567-0e02b2c3d479', '{"details":"Test booking created"}'); 