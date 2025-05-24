package com.hotel.backendservice.config;

import org.junit.jupiter.api.Tag;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;

/**
 * Base class for integration tests in the application
 * Uses a mocked DataSource instead of TestContainers to avoid Docker dependency
 */
@Tag("integration")
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public abstract class AbstractIntegrationTest {

    @MockBean
    DataSource dataSource;

    // Instead of connecting to a real database with TestContainers,
    // we use a mocked DataSource. This allows tests to run without Docker.
}
