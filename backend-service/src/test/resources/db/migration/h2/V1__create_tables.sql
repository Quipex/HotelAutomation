-- Create simplified tables for H2 testing

-- Client table
CREATE TABLE client (
    id UUID PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    middle_name VARCHAR(255),
    full_name VARCHAR(765), -- Simplified from generated column
    phones VARCHAR(1000), -- Simplified from TEXT[]
    email VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Room table
CREATE TABLE room (
    id UUID PRIMARY KEY,
    number VARCHAR(50) UNIQUE,
    floor INT,
    has_sea_view BOOLEAN,
    balcony_side VARCHAR(50),
    type VARCHAR(50),
    max_adults INT,
    capacity INT,
    notes TEXT
);

-- Booking table
CREATE TABLE booking (
    id UUID PRIMARY KEY,
    client_id UUID,
    room_id UUID,
    checkin_date DATE,
    checkout_date DATE,
    status VARCHAR(50),
    source VARCHAR(100),
    cost NUMERIC(10, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    source_system_id VARCHAR(100),
    channel_id VARCHAR(100),
    channel_name VARCHAR(100),
    FOREIGN KEY (client_id) REFERENCES client(id),
    FOREIGN KEY (room_id) REFERENCES room(id)
);

-- Booking history table
CREATE TABLE booking_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id UUID,
    field VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    timestamp TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (booking_id) REFERENCES booking(id)
);

-- Payment table
CREATE TABLE payment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id UUID,
    amount NUMERIC(10, 2),
    paid_at TIMESTAMP WITH TIME ZONE,
    account_type VARCHAR(50),
    account_number VARCHAR(100),
    FOREIGN KEY (booking_id) REFERENCES booking(id)
);

-- Sync status table
CREATE TABLE sync_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50),
    duration BIGINT,
    details TEXT
);

-- Notification table
CREATE TABLE notification (
    id UUID PRIMARY KEY,
    channel VARCHAR(50),
    message TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    error_details TEXT
);

-- Audit actor table
CREATE TABLE audit_actor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(50),
    user_id VARCHAR(100),
    user_name VARCHAR(255),
    user_nick VARCHAR(100),
    user_agent VARCHAR(255),
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE
);

-- Audit log table
CREATE TABLE audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE,
    actor_id BIGINT,
    action VARCHAR(100),
    object_type VARCHAR(50),
    object_id VARCHAR(100),
    details VARCHAR(4000), -- Simplified from JSONB
    FOREIGN KEY (actor_id) REFERENCES audit_actor(id)
);

-- Create index on email (case insensitive)
CREATE INDEX idx_clients_email ON client (email);

-- Create index on phone (simplified)
CREATE INDEX idx_clients_phone ON client (phones);

-- Create index on full_name (simplified)
CREATE INDEX idx_clients_full_name ON client (full_name);

-- Insert initial sync status record
INSERT INTO sync_status (status, details) VALUES ('NEVER_RUN', 'Sync has never been run'); 