package com.hotel.backendv2.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestConfig {

    @Bean
    public TestDataLoader testDataLoader() {
        return new TestDataLoader();
    }
}
