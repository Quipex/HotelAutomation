package com.hotel.backendservice;

import com.hotel.backendservice.config.AbstractIntegrationTest;
import com.hotel.backendservice.sync.EasyMsClient;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

class BackendServiceApplicationTests extends AbstractIntegrationTest {

    @MockitoBean
    private EasyMsClient easyMsClientRest;

    @Test
    void contextLoads() {
        // Basic test to verify that the Spring context loads correctly
    }
}
