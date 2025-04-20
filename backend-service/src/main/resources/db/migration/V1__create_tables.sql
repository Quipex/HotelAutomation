-- Create clients table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email (case insensitive)
CREATE INDEX idx_clients_email ON clients (LOWER(email));

-- Create index on phone
CREATE INDEX idx_clients_phone ON clients (phone);

-- Create extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create computed column for full_name with index
ALTER TABLE clients ADD COLUMN IF NOT EXISTS full_name TEXT GENERATED ALWAYS AS 
    (first_name || ' ' || last_name || CASE WHEN middle_name IS NULL THEN '' ELSE ' ' || middle_name END) STORED;
CREATE INDEX idx_clients_full_name_trgm ON clients USING GIN (full_name gin_trgm_ops);

-- Create rooms table
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL UNIQUE,
    floor INTEGER NOT NULL,
    has_sea_view BOOLEAN DEFAULT FALSE,
    balcony_side VARCHAR(20),
    room_type VARCHAR(50) NOT NULL,
    max_adults INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on room_number
CREATE INDEX idx_rooms_number ON rooms (room_number);

-- Create bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    room_id INTEGER REFERENCES rooms(id),
    checkin_date DATE NOT NULL,
    checkout_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    source VARCHAR(50) NOT NULL,
    cost DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (checkout_date > checkin_date)
);

-- Create indexes on checkin_date and checkout_date
CREATE INDEX idx_bookings_checkin ON bookings (checkin_date);
CREATE INDEX idx_bookings_checkout ON bookings (checkout_date);

-- Create booking history table
CREATE TABLE booking_history (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    field_name VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(100)
);

-- Create audit log table
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    platform VARCHAR(20) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(100),
    user_nick VARCHAR(100),
    user_agent TEXT,
    action VARCHAR(50) NOT NULL,
    object_type VARCHAR(20),
    object_id INTEGER,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sync status table
CREATE TABLE sync_status (
    id SERIAL PRIMARY KEY,
    last_sync_at TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    duration INTEGER, -- in milliseconds
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    channel VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    retry_count INTEGER DEFAULT 0,
    scheduled_at TIMESTAMP NOT NULL,
    last_attempt_at TIMESTAMP,
    error_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial sync status record
INSERT INTO sync_status (status, details) VALUES ('NEVER_RUN', 'Sync has never been run'); 