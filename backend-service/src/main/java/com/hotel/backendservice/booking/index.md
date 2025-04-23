# Booking Package

This package contains components for managing hotel bookings, including creation, modification, cancellation, and search functionality.

## Files

- **BookingEntity.java** - JPA entity representing a hotel booking, with fields for client, room, dates, status, cost, and external system identifiers. Contains relationships to client and room entities.

- **BookingHistoryEntity.java** - Entity for tracking history of changes to bookings, enabling audit trail of booking modifications.

- **BookingDto.java** - Data Transfer Object that represents booking information for API requests and responses, decoupling the internal entity model from the external API contract.

- **BookingMapper.java** - Mapper class responsible for converting between BookingEntity and BookingDto objects, allowing separation between persistence and API layers.

- **BookingController.java** - REST controller exposing booking-related API endpoints including search, creation, updates, and cancellation operations. Documented with Swagger annotations.

- **BookingService.java** - Service layer implementing booking business logic, including validation, creation, updates, and search operations. Manages transactions and orchestrates repository operations.

- **BookingRepository.java** - JPA repository interface providing standard CRUD operations and custom queries for BookingEntity objects.

- **BookingHistoryRepository.java** - JPA repository for BookingHistoryEntity objects, enabling retrieval of booking change history.

- **BookingJooqRepository.java** - Advanced repository implementation using jOOQ for complex booking queries and search functionality, providing more flexible querying capabilities than standard JPA. 