package com.hotel.backendservice.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

/**
 * Test configuration that provides an in-memory H2 database.
 * Used to avoid PostgreSQL dependency during tests.
 */
@Configuration
@Profile("test")
public class TestDataSourceConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        return DataSourceBuilder.create()
            .url("jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1")
            .driverClassName("org.h2.Driver")
            .username("sa")
            .password("")
            .build();
    }
}
