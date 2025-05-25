# EasyMS Integration Package

This package contains utilities and services for integrating with the EasyMS PMS (Property Management System).

## Components

- **DateConverter**: Utility class for converting LocalDate objects to epoch milliseconds in UTC timezone, used for API communication with EasyMS system.
  - `convertToEpochMilli(LocalDate)`: Converts a LocalDate to epoch milliseconds at UTC midnight

## Testing

The components in this package are tested in the corresponding test package:
- `DateConverterTest`: Tests for the DateConverter utility methods