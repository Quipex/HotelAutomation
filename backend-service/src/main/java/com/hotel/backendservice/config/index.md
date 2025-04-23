# Configuration Package

This package contains configuration classes for the hotel automation system.

## Files

- **OpenApiConfig.java** - Configuration for the OpenAPI/Swagger documentation, setting up metadata and server information for the API documentation interface. Provides structured API documentation for developers.

- **GlobalExceptionHandler.java** - Global exception handling configuration using Spring's @ControllerAdvice. Provides centralized handling of exceptions across the application, including validation failures and runtime exceptions, returning standardized error responses.

- **EasyMsConfig.java** - Configuration for the EasyMS PMS (Property Management System) client. Sets up a WebClient with appropriate timeouts and connection settings for making HTTP requests to the EasyMS system. 