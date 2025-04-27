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
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

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
    private RestTemplate restTemplate;

    @MockBean
    private MeterRegistry meterRegistry;

    @Autowired
    private TelegramNotificationService telegramNotificationService;

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
    }

    @Test
    public void testNotifySuccessfully() {
        // Given
        String message = "Test message";
        ResponseEntity<String> responseEntity = new ResponseEntity<>("{\"ok\":true}", HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), anyString(), eq(String.class))).thenReturn(responseEntity);

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
        ResponseEntity<String> responseEntity = new ResponseEntity<>("{\"ok\":false}", HttpStatus.BAD_REQUEST);
        when(restTemplate.postForEntity(anyString(), anyString(), eq(String.class))).thenReturn(responseEntity);

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
        when(restTemplate.postForEntity(anyString(), anyString(), eq(String.class)))
            .thenThrow(new RuntimeException("Connection error"));

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
        ResponseEntity<String> responseEntity = new ResponseEntity<>("{\"ok\":true}", HttpStatus.OK);

        ArgumentCaptor<String> urlCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> bodyCaptor = ArgumentCaptor.forClass(String.class);

        when(restTemplate.postForEntity(urlCaptor.capture(), bodyCaptor.capture(), eq(String.class)))
            .thenReturn(responseEntity);

        // When
        telegramNotificationService.notify("telegram", message);

        // Then
        String capturedUrl = urlCaptor.getValue();
        String capturedBody = bodyCaptor.getValue();

        // Verify URL format
        assertEquals("https://api.telegram.org/bot" + expectedBotToken + "/sendMessage", capturedUrl);

        // Verify payload format
        assertTrue(capturedBody.contains("\"chat_id\": \"" + expectedChatId + "\""));
        assertTrue(capturedBody.contains("\"text\": \"" + message + "\""));
        assertTrue(capturedBody.contains("\"parse_mode\": \"HTML\""));
    }

    @Test
    public void testMessageWithSpecialCharacters() {
        // Given
        String message = "Test message with \"quotes\" and special chars: \\ / \n";
        ResponseEntity<String> responseEntity = new ResponseEntity<>("{\"ok\":true}", HttpStatus.OK);

        ArgumentCaptor<String> bodyCaptor = ArgumentCaptor.forClass(String.class);
        when(restTemplate.postForEntity(anyString(), bodyCaptor.capture(), eq(String.class)))
            .thenReturn(responseEntity);

        // When
        telegramNotificationService.notify("telegram", message);

        // Then
        String capturedBody = bodyCaptor.getValue();

        // Verify quotes are escaped
        assertTrue(capturedBody.contains("\"text\": \"Test message with \\\"quotes\\\" and special chars: \\\\ / \\n\""));

        // Verify the entity is saved correctly with original message
        ArgumentCaptor<NotificationEntity> entityCaptor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(entityCaptor.capture());
        assertEquals(message, entityCaptor.getValue().getMessage());
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
        verify(restTemplate, never()).postForEntity(anyString(), anyString(), eq(String.class));
    }
}
