# EasyMS Integration Package

This package contains utilities and services for integrating with the EasyMS PMS (Property Management System).

## Components

- **DateConverter**: Utility class for converting LocalDate objects to epoch milliseconds in UTC timezone, used for API communication with EasyMS system.
  - `convertToEpochMilli(LocalDate)`: Converts a LocalDate to epoch milliseconds at UTC midnight

- **EasyMsRestTemplateConfig**: Configuration class that provides a RestTemplate bean for EasyMS API communication.
  - Features:
    - OAuth2 Bearer token authentication
    - Configurable timeouts (connect and read)
    - Retry mechanism using resilience4j
    - Metrics monitoring with micrometer
    - Bean qualified as `easyms-client`

- **EasyMsAuthenticationManager**: Manages authentication with the EasyMS API.
  - Features:
    - Automatic token acquisition using OAuth2 password grant flow
    - Token caching in an AtomicReference
    - Automatic token refresh 5 minutes before expiration
    - Force refresh capability for handling authentication errors

- **EasyMsBearerAuthInterceptor**: Interceptor for RestTemplate that adds Bearer token authentication.
  - Features:
    - Adds Bearer token to outgoing requests
    - Detects 401/403 responses and triggers token refresh
    - Automatic retry of failed authentication requests

## Testing

The components in this package are tested in the corresponding test package:
- `DateConverterTest`: Tests for the DateConverter utility methods
- `EasyMsRestTemplateConfigTest`: Tests for the EasyMsRestTemplateConfig configuration
- `EasyMsAuthenticationManagerTest`: Tests for the EasyMsAuthenticationManager token handling
- `EasyMsBearerAuthInterceptorTest`: Tests for the EasyMsBearerAuthInterceptor