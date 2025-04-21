package com.hotel.backendservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import com.hotel.backendservice.sync.EasyMsClientRest;

@SpringBootTest
@ActiveProfiles("test")
class BackendServiceApplicationTests {

    @MockBean
    private EasyMsClientRest easyMsClientRest;

    @Test
    void contextLoads() {
        // Basic test to verify that the Spring context loads correctly
    }
} 