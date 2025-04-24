# Test Configuration Guide

## PostgreSQL Testcontainers Setup

This project uses [Testcontainers](https://www.testcontainers.org/) with PostgreSQL for integration testing. Testcontainers provides lightweight, throwaway instances of common databases that can be used for testing.

### Base Test Classes

The project provides two abstract base classes for tests:

1. **AbstractIntegrationTest**: For general integration tests with Spring Boot (`@SpringBootTest`).
2. **AbstractRepositoryTest**: Specifically for repository tests (`@DataJpaTest`).

Both classes set up a PostgreSQL container and configure Spring to use it during tests.

### Usage

To use these base classes, simply extend them in your test classes:

```java
// For repository tests
class YourRepositoryTest extends AbstractRepositoryTest {
    // Your tests here
}

// For integration tests
class YourIntegrationTest extends AbstractIntegrationTest {
    // Your tests here
}
```

### Test Configuration

The test configuration is provided by the base classes and `application-test.yml`. The PostgreSQL connection properties are dynamically set by the base classes using `@DynamicPropertySource`.

### Requirements

- Docker must be installed and running on your system to use Testcontainers
- The first test run might take longer as it downloads the PostgreSQL Docker image

### Test Data

Test data is managed through Flyway migrations, ensuring test data consistency across different environments.

### Troubleshooting

If you're encountering issues with Testcontainers:

1. Ensure Docker is running and properly configured
2. Check Docker resource settings if tests are slow or containers fail to start
3. Look for Testcontainers logs in the test output for specific error messages