# Database Migration Scripts

This directory contains Flyway migration scripts that manage the database schema for the Hotel Automation system.

## Migration Files

### V1__create_tables.sql

Creates the initial database schema with the following tables:

- `client` - Customer information
- `room` - Hotel room details
- `booking` - Reservation information
- `booking_history` - History of changes to bookings
- `payment` - Payment records
- `sync_status` - Status of synchronization with external PMS
- `notification` - System notifications
- `audit_actor` - Users/systems that performed actions
- `audit_log` - Audit trail of system actions

### V2__add_indexes.sql

Creates indexes to improve query performance:

- GIN indexes for text search on client names
- GIN indexes for array search on client phones
- B-tree indexes for date searches on bookings
- B-tree indexes for various other fields

## Schema Design Highlights

1. **UUID as Primary Keys**: Tables like `client`, `room`, `booking` use UUID primary keys for better distribution and
   flexibility.

2. **Generated Columns**: The `client` table uses a generated `full_name` column that combines first, middle, and last
   names.

3. **Array Types**: The `client.phones` field uses PostgreSQL's native array type to store multiple phone numbers.

4. **Audit Trail**: The `booking_history` table tracks all changes to bookings, while `audit_log` provides a system-wide
   audit trail.

5. **Search Optimization**: GIN indexes with pg_trgm for fuzzy text search capabilities.

## Verifying Migrations

When the application starts, Flyway will automatically apply these migrations. To manually verify:

1. Start the application using `docker-compose up`
2. Connect to the database: `docker exec -it hotel-automation_postgres_1 psql -U postgres -d hotel_db`
3. List tables: `\dt`
4. List indexes: `\di` 
