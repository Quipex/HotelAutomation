package com.hotel.backendv2;

import com.hotel.backendv2.config.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;

import static org.assertj.core.api.Assertions.assertThat;

class ApplicationStartupTests extends AbstractIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void applicationStartsSuccessfully() {
        // Проверяем, что порт был назначен
        assertThat(port).isGreaterThan(0);
    }
} 