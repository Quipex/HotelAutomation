-- Create tables for Hotel Automation System

-- Client table
CREATE TABLE client
(
  id          UUID PRIMARY KEY,
  first_name  VARCHAR(255),
  last_name   VARCHAR(255),
  middle_name VARCHAR(255),
  full_name   TEXT GENERATED ALWAYS AS
                (COALESCE(first_name, '') || ' ' || COALESCE(last_name, '') || ' ' || COALESCE(middle_name, '')) STORED,
  phones      TEXT[],
  email       VARCHAR(255),
  notes       TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Room table
CREATE TABLE room
(
  id           UUID PRIMARY KEY,
  number       VARCHAR(50) UNIQUE,
  floor        INT,
  has_sea_view BOOLEAN,
  balcony_side VARCHAR(50),
  type         VARCHAR(50),
  max_adults   INT,
  capacity     INT,
  notes        TEXT
);

-- Booking table
CREATE TABLE booking
(
  id               UUID PRIMARY KEY,
  client_id        UUID REFERENCES client (id),
  room_id          UUID REFERENCES room (id),
  checkin_date     DATE,
  checkout_date    DATE,
  status           VARCHAR(50),
  source           VARCHAR(100),
  cost             NUMERIC(10, 2),
  notes            TEXT,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  source_system_id VARCHAR(100),
  channel_id       VARCHAR(100),
  channel_name     VARCHAR(100)
);

-- Booking history table
CREATE TABLE booking_history
(
  id         BIGSERIAL PRIMARY KEY,
  booking_id UUID REFERENCES booking (id),
  field      VARCHAR(100),
  old_value  TEXT,
  new_value  TEXT,
  timestamp  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Payment table
CREATE TABLE payment
(
  id             BIGSERIAL PRIMARY KEY,
  booking_id     UUID REFERENCES booking (id),
  amount         NUMERIC(10, 2),
  paid_at        TIMESTAMP,
  account_type   VARCHAR(50),
  account_number VARCHAR(100)
);

-- Sync status table
CREATE TABLE sync_status
(
  id           BIGSERIAL PRIMARY KEY,
  last_sync_at TIMESTAMP,
  status       VARCHAR(50),
  duration     BIGINT,
  details      TEXT
);

-- Notification table
CREATE TABLE notification
(
  id              UUID PRIMARY KEY,
  channel         VARCHAR(50),
  message         TEXT,
  status          VARCHAR(50),
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  last_attempt_at TIMESTAMP,
  error_details   TEXT
);

-- Audit actor table
CREATE TABLE audit_actor
(
  id         BIGSERIAL PRIMARY KEY,
  platform   VARCHAR(50),
  user_id    VARCHAR(100),
  user_name  VARCHAR(255),
  user_nick  VARCHAR(100),
  user_agent VARCHAR(255),
  ip_address VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Audit log table
CREATE TABLE audit_log
(
  id          BIGSERIAL PRIMARY KEY,
  timestamp   TIMESTAMP NOT NULL DEFAULT NOW(),
  actor_id    BIGINT REFERENCES audit_actor (id),
  action      VARCHAR(100),
  object_type VARCHAR(50),
  object_id   VARCHAR(100),
  details     JSONB
);

-- Create index on email (case insensitive)
CREATE INDEX idx_clients_email ON client (LOWER(email));

-- Create index on phone
CREATE INDEX idx_clients_phone ON client USING GIN (phones);

-- Create extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create computed column for full_name with index
CREATE INDEX idx_clients_full_name_trgm ON client USING GIN (full_name gin_trgm_ops);

-- Insert initial sync status record
INSERT INTO sync_status (status, details)
VALUES ('NEVER_RUN', 'Sync has never been run');
