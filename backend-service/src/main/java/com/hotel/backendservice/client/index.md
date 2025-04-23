# Client Package

This package contains components for managing hotel clients (guests), including creation, modification, and search functionality.

## Files

- **ClientEntity.java** - JPA entity representing a hotel client, with fields for personal information including name, contact details, and notes. Includes automatic timestamp handling for creation and updates.

- **ClientDto.java** - Data Transfer Object that represents client information for API requests and responses, decoupling the internal entity model from the external API contract.

- **ClientMapper.java** - Mapper class responsible for converting between ClientEntity and ClientDto objects, allowing separation between persistence and API layers.

- **ClientController.java** - REST controller exposing client-related API endpoints including search, creation, and update operations. Documented with Swagger annotations for better API documentation.

- **ClientService.java** - Service layer implementing client business logic, including creation, updates, and name-based fuzzy search operations. Manages transactions and orchestrates repository operations.

- **ClientRepository.java** - JPA repository interface providing standard CRUD operations and custom queries for ClientEntity objects, including fuzzy name search functionality. 