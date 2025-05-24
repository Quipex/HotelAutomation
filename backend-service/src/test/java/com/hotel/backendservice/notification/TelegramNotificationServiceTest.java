package com.hotel.backendservice.notification;

import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.UUID;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@WebMvcTest(TelegramNotificationService.class)
@ActiveProfiles("test")
@Import(TestConfig.class)
public class TelegramNotificationServiceTest {

    @MockBean
    private NotificationRepository notificationRepository;

    @MockBean
    private WebClient webClient;

    @MockBean
    private MeterRegistry meterRegistry;

    @Autowired
    private TelegramNotificationService telegramNotificationService;
    
    // Mock WebClient components
    private WebClient.RequestBodyUriSpec requestBodyUriSpec;
    private WebClient.RequestBodySpec requestBodySpec;
    private WebClient.ResponseSpec responseSpec;

    @BeforeEach
    public void setUp() {
        // Disable admin alerts for testing
        telegramNotificationService.setAdminAlertsEnabled(false);

        // To simplify testing, we can stub the UUID generation
        when(notificationRepository.save(any(NotificationEntity.class))).thenAnswer(invocation -> {
            NotificationEntity entity = invocation.getArgument(0);
            if (entity.getId() == null) {
                entity.setId(UUID.randomUUID());
            }
            return entity;
        });

        // Mock the meter counters
        when(meterRegistry.counter(eq("notifications.sent"), anyString(), anyString())).thenReturn(mock(io.micrometer.core.instrument.Counter.class));
        when(meterRegistry.counter(eq("notifications.failed"), anyString(), anyString())).thenReturn(mock(io.micrometer.core.instrument.Counter.class));
        
        // Setup WebClient mocks
        requestBodyUriSpec = mock(WebClient.RequestBodyUriSpec.class);
        requestBodySpec = mock(WebClient.RequestBodySpec.class);
        responseSpec = mock(WebClient.ResponseSpec.class);
        
        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
        when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.bodyValue(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.retrieve()).thenReturn(responseSpec);
    }

    @Test
    public void testNotifySuccessfully() {
        // Given
        String message = "Test message";
        
        // Setup mock response
        when(responseSpec.onStatus(any(), any())).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just("{\"ok\":true}"));
        
        // When
        telegramNotificationService.notify("telegram", message);

        // Then
        ArgumentCaptor<NotificationEntity> captor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captor.capture());

        NotificationEntity savedNotification = captor.getValue();
        assertEquals("telegram", savedNotification.getChannel());
        assertEquals(message, savedNotification.getMessage());
        assertEquals(NotificationStatus.SENT, savedNotification.getStatus());
        assertNull(savedNotification.getErrorDetails());

        // Verify metric counter was incremented
        verify(meterRegistry).counter("notifications.sent", "channel", "telegram");
    }

    @Test
    public void testNotifyFailsWithUnsuccessfulResponse() {
        // Given
        String message = "Test message";
        
        // Setup mock response for failure
        when(responseSpec.onStatus(any(), any())).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.error(new RuntimeException("Failed to send Telegram message")));
        
        // When
        telegramNotificationService.notify("telegram", message);

        // Then
        ArgumentCaptor<NotificationEntity> captor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captor.capture());

        NotificationEntity savedNotification = captor.getValue();
        assertEquals("telegram", savedNotification.getChannel());
        assertEquals(message, savedNotification.getMessage());
        assertEquals(NotificationStatus.FAILED, savedNotification.getStatus());
        assertEquals("Failed to send message to Telegram", savedNotification.getErrorDetails());

        // Verify metric counter was incremented
        verify(meterRegistry).counter("notifications.failed", "channel", "telegram");
    }

    @Test
    public void testNotifyFailsWithException() {
        // Given
        String message = "Test message";
        
        // Setup mock to throw exception
        when(requestBodySpec.retrieve()).thenThrow(new RuntimeException("Connection error"));
        
        // When
        telegramNotificationService.notify("telegram", message);

        // Then
        ArgumentCaptor<NotificationEntity> captor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captor.capture());

        NotificationEntity savedNotification = captor.getValue();
        assertEquals("telegram", savedNotification.getChannel());
        assertEquals(message, savedNotification.getMessage());
        assertEquals(NotificationStatus.FAILED, savedNotification.getStatus());
        assertEquals("Connection error", savedNotification.getErrorDetails());

        // Verify metric counter was incremented
        verify(meterRegistry).counter("notifications.failed", "channel", "telegram");
    }

    @Test
    public void testTelegramApiUriAndPayloadFormat() {
        // Given
        String message = "Test notification message";
        String expectedBotToken = "test-token"; // From application-test.yml
        String expectedChatId = "123456"; // From application-test.yml
        
        // Setup mock response
        when(responseSpec.onStatus(any(), any())).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just("{\"ok\":true}"));
        
        // Capture the URI
        ArgumentCaptor<String> uriCaptor = ArgumentCaptor.forClass(String.class);
        
        // When
        telegramNotificationService.notify("telegram", message);

        // Then
        verify(requestBodyUriSpec).uri(uriCaptor.capture());
        String capturedUri = uriCaptor.getValue();
        
        // Verify URL format
        assertEquals("https://api.telegram.org/bot" + expectedBotToken + "/sendMessage", capturedUri);
        
        // Verify payload using ArgumentCaptor
        ArgumentCaptor<Object> bodyCaptor = ArgumentCaptor.forClass(Object.class);
        verify(requestBodySpec).bodyValue(bodyCaptor.capture());
        
        Object capturedBody = bodyCaptor.getValue();
        assertNotNull(capturedBody);
        assertTrue(capturedBody.toString().contains("chat_id"));
        assertTrue(capturedBody.toString().contains("text"));
        assertTrue(capturedBody.toString().contains("parse_mode"));
    }

    @Test
    public void testNotifyWithUnsupportedChannel() {
        // Given
        String channel = "email";
        String message = "Test message";

        // When
        telegramNotificationService.notify(channel, message);

        // Then
        ArgumentCaptor<NotificationEntity> captor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captor.capture());

        NotificationEntity savedNotification = captor.getValue();
        assertEquals(channel, savedNotification.getChannel());
        assertEquals(message, savedNotification.getMessage());
        assertEquals(NotificationStatus.FAILED, savedNotification.getStatus());
        assertEquals("Unsupported notification channel", savedNotification.getErrorDetails());

        // Verify no HTTP call is made for unsupported channels
        verify(webClient, never()).post();
    }
}
