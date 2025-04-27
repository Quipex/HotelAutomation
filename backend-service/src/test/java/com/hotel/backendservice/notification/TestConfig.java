package com.hotel.backendservice.notification;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.web.client.RestTemplate;

/**
 * Test configuration class that provides test-specific beans
 */
@TestConfiguration
public class TestConfig {

    /**
     * Provides a RestTemplate bean that can be mocked in tests
     * We mark it as @Primary to ensure it's used instead of any other RestTemplate
     */
    @Bean
    @Primary
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * Provides a MeterRegistry bean for metrics testing
     */
    @Bean
    @Primary
    public MeterRegistry meterRegistry() {
        return new SimpleMeterRegistry();
    }
}
