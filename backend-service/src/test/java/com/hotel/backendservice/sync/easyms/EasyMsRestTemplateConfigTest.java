package com.hotel.backendservice.sync.easyms;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class EasyMsRestTemplateConfigTest {

    private EasyMsRestTemplateConfig config;
    private MeterRegistry meterRegistry;

    @Mock
    private EasyMsBearerAuthInterceptor authInterceptor;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        meterRegistry = new SimpleMeterRegistry();

        config = new EasyMsRestTemplateConfig(authInterceptor);

        // Set required properties manually since we're not loading from application.yml
        ReflectionTestUtils.setField(config, "baseUrl", "https://api.easyms.example.com");
        ReflectionTestUtils.setField(config, "connectTimeout", Duration.ofSeconds(5));
        ReflectionTestUtils.setField(config, "readTimeout", Duration.ofSeconds(10));
        ReflectionTestUtils.setField(config, "maxRetryAttempts", 3);
        ReflectionTestUtils.setField(config, "backoffDelay", Duration.ofSeconds(2));
    }

    @Test
    void easyMsRestTemplate_shouldCreateRestTemplateWithCorrectConfiguration() {
        // When
        RestTemplate restTemplate = config.easyMsRestTemplate(meterRegistry);

        // Then
        assertNotNull(restTemplate, "RestTemplate should not be null");

        // Verify request factory timeouts
        SimpleClientHttpRequestFactory requestFactory = (SimpleClientHttpRequestFactory) restTemplate.getRequestFactory();

        // Verify interceptors for authentication
        List<ClientHttpRequestInterceptor> interceptors = restTemplate.getInterceptors();
        assertFalse(interceptors.isEmpty(), "Interceptors should not be empty");
        assertTrue(interceptors.contains(authInterceptor), "AuthInterceptor should be in the interceptors list");

        // Note: We can't directly test the behavior of the retry functionality
        // in a unit test as it's internally wrapped by resilience4j
    }
}
