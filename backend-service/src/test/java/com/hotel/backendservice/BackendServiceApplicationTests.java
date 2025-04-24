package com.hotel.backendservice;

import com.hotel.backendservice.config.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.hotel.backendservice.sync.EasyMsClientRest;

class BackendServiceApplicationTests extends AbstractIntegrationTest {

    @MockBean
    private EasyMsClientRest easyMsClientRest;

    @Test
    void contextLoads() {
        // Basic test to verify that the Spring context loads correctly
    }
} 