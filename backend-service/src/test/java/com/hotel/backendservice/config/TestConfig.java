package com.hotel.backendservice.config;

import com.hotel.backendservice.notification.NotificationRetryJob;
import com.hotel.backendservice.sync.EasyMsClient;
import com.hotel.backendservice.sync.PmsClient;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.web.reactive.function.client.WebClient;

import static org.mockito.Mockito.mock;

@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public WebClient webClient() {
        return mock(WebClient.class);
    }
    
    @Bean
    @Primary
    public NotificationRetryJob notificationRetryJob() {
        return mock(NotificationRetryJob.class);
    }
    
    @Bean
    @Primary
    public PmsClient pmsClient() {
        return mock(PmsClient.class);
    }
    
    @Bean
    @Primary
    public EasyMsClient easyMsClient() {
        return mock(EasyMsClient.class);
    }
} 