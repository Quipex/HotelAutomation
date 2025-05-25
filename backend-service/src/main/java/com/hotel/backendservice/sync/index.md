# Sync Package

This package contains components for synchronizing data between the hotel's system and external Property Management Systems (PMS).

## Components

### EasyMsClient

Implementation of the PMS Client interface that communicates with the EasyMS PMS system to fetch booking data.
- `getBookings`: Fetches bookings from EasyMS for a date range. Configured to fetch the current year's bookings from the start month to the end month defined in the application configuration.
- `fetchBookingById`: Fetches a specific booking by its ID from EasyMS.
- `syncBookings`: Transactional method that fetches bookings from EasyMS, maps them to our entities, and returns them for persistence. Requires a map of room IDs to room entities and a map of client keys to client entities.

### PmsClient

Interface that defines methods required for interaction with any PMS system.

### BookingMapper

Maps data from PMS DTOs to our internal entity models.
- `toEntities`: Converts BookingDto objects from EasyMS to BookingEntity objects for our database.

## DTOs

### BookingDto

Data Transfer Objects that represent the structure of data returned from the EasyMS API.
- Contains nested classes for customer information, room reservations, and extra charges.

## Configuration

The sync functionality can be configured in the application.yml:

```yaml
easyms:
  organization-id: 446
  sync:
    start-month: 5  # May
    end-month: 9    # September
```

## Error Handling

Errors during synchronization are:
1. Logged at the appropriate level
2. Reported via the notification service (currently Telegram)
3. Handled gracefully to prevent synchronization failures from affecting the entire application

## Implementation Details

1. **Date Handling**: The system uses `DateConverter` to convert between LocalDate and the epoch millisecond format required by EasyMS.
2. **DTO Mapping**: JSON responses are parsed into DTOs using Jackson. If the response structure doesn't match our DTOs, an error is logged and reported, but the system continues to function.
3. **Entity Mapping**: DTOs are mapped to our internal entities using the BookingMapper. Each room reservation in a booking becomes a separate BookingEntity.
4. **Metrics**: The system tracks performance metrics using Micrometer to monitor response times from EasyMS.
5. **Idempotency**: Generated UUIDs for BookingEntity are derived from the roomReservationId to ensure the same booking doesn't get duplicated across syncs.

## Files

- **PmsClient.java** - Interface defining the contract for communication with external Property Management Systems,
  including methods for authentication and fetching booking data.

- **EasyMsClientRest.java** - Implementation of the PmsClient interface for connecting to the EasyMS PMS system via REST
  API, handling authentication, retries, and data mapping.

- **SyncStatusEntity.java** - JPA entity representing the status of data synchronization operations, including
  timestamps, duration, status, and details of the sync process.

- **SyncStatusRepository.java** - JPA repository for SyncStatusEntity, providing methods to persist and retrieve
  synchronization status records.

## Subdirectories

- **dto/** - Contains Data Transfer Objects used specifically for communication with external PMS systems. 
