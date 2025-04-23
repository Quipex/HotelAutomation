# Room Package

This package contains components for managing hotel rooms, including their properties, availability, and search functionality.

## Files

- **RoomEntity.java** - JPA entity representing a hotel room, with fields for room properties such as number, floor, type, capacity, and special features like sea view or balcony side.

- **RoomDto.java** - Data Transfer Object that represents room information for API requests and responses, decoupling the internal entity model from the external API contract.

- **RoomMapper.java** - Mapper class responsible for converting between RoomEntity and RoomDto objects, allowing separation between persistence and API layers.

- **RoomController.java** - REST controller exposing room-related API endpoints including search, creation, updates, and availability checking. Documented with Swagger annotations for better API documentation.

- **RoomService.java** - Service layer implementing room business logic, including creation, updates, and availability search operations. Manages transactions and orchestrates repository operations.

- **RoomRepository.java** - JPA repository interface providing standard CRUD operations and custom queries for RoomEntity objects. Includes native SQL queries for complex operations such as room availability search and pattern-based room number searches. 