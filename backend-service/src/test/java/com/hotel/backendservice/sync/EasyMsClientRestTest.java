package com.hotel.backendservice.sync;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.backendservice.notification.NotificationService;
import com.hotel.backendservice.sync.dto.AuthResponseDto;
import com.hotel.backendservice.sync.dto.BookingDto;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EasyMsClientRestTest {

    private MockWebServer mockWebServer;
    private EasyMsClientRest easyMsClient;

    @Mock
    private NotificationService notificationService;

    private final MeterRegistry meterRegistry = new SimpleMeterRegistry();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();

        WebClient webClient = WebClient.builder()
            .baseUrl(mockWebServer.url("/").toString())
            .build();

        easyMsClient = new EasyMsClientRest(webClient, meterRegistry, notificationService);
        // Set login/password via reflection
        try {
            java.lang.reflect.Field loginField = EasyMsClientRest.class.getDeclaredField("login");
            loginField.setAccessible(true);
            loginField.set(easyMsClient, "testuser");

            java.lang.reflect.Field passwordField = EasyMsClientRest.class.getDeclaredField("password");
            passwordField.setAccessible(true);
            passwordField.set(easyMsClient, "testpass");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @AfterEach
    void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @Test
    void testAuthenticate() throws Exception {
        // Prepare mock response
        AuthResponseDto authResponse = new AuthResponseDto("test-token", 3600L);
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .setBody(objectMapper.writeValueAsString(authResponse)));

        // Call the method
        String token = easyMsClient.authenticate();

        // Verify result
        assertEquals("test-token", token);

        // Verify request
        RecordedRequest recordedRequest = mockWebServer.takeRequest();
        assertEquals("POST", recordedRequest.getMethod());
        assertEquals("/login", recordedRequest.getPath());

        // Verify notification service wasn't called
        verify(notificationService, never()).notify(anyString(), anyString());
    }

    @Test
    void testFetchNewBookings() throws Exception {
        // Prepare mock responses
        AuthResponseDto authResponse = new AuthResponseDto("test-token", 3600L);
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .setBody(objectMapper.writeValueAsString(authResponse)));

        // Prepare mock bookings response
        List<BookingDto> bookings = List.of(
            BookingDto.builder().pmsId("booking1").guestName("John Doe").build(),
            BookingDto.builder().pmsId("booking2").guestName("Jane Smith").build()
        );
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .setBody(objectMapper.writeValueAsString(bookings)));

        // Call the method
        Instant since = Instant.now().minusSeconds(3600);
        List<BookingDto> result = easyMsClient.fetchNewBookings(since);

        // Verify result
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("booking1", result.get(0).getPmsId());
        assertEquals("John Doe", result.get(0).getGuestName());

        // Verify requests
        RecordedRequest authRequest = mockWebServer.takeRequest();
        assertEquals("POST", authRequest.getMethod());
        assertEquals("/login", authRequest.getPath());

        RecordedRequest bookingsRequest = mockWebServer.takeRequest();
        assertEquals("GET", bookingsRequest.getMethod());
        assertTrue(bookingsRequest.getPath().startsWith("/bookings?since="));
        assertEquals("Bearer test-token", bookingsRequest.getHeader("Authorization"));

        // Verify notification service wasn't called
        verify(notificationService, never()).notify(anyString(), anyString());
    }

    @Test
    void testFetchBookingById() throws Exception {
        // Prepare mock responses
        AuthResponseDto authResponse = new AuthResponseDto("test-token", 3600L);
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .setBody(objectMapper.writeValueAsString(authResponse)));

        // Prepare mock booking response
        BookingDto booking = BookingDto.builder()
            .pmsId("booking1")
            .guestName("John Doe")
            .build();
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(200)
            .setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .setBody(objectMapper.writeValueAsString(booking)));

        // Call the method
        BookingDto result = easyMsClient.fetchBookingById("booking1");

        // Verify result
        assertNotNull(result);
        assertEquals("booking1", result.getPmsId());
        assertEquals("John Doe", result.getGuestName());

        // Verify requests
        RecordedRequest authRequest = mockWebServer.takeRequest();
        assertEquals("POST", authRequest.getMethod());
        assertEquals("/login", authRequest.getPath());

        RecordedRequest bookingRequest = mockWebServer.takeRequest();
        assertEquals("GET", bookingRequest.getMethod());
        assertEquals("/bookings/booking1", bookingRequest.getPath());
        assertEquals("Bearer test-token", bookingRequest.getHeader("Authorization"));

        // Verify notification service wasn't called
        verify(notificationService, never()).notify(anyString(), anyString());
    }

    @Test
    void testAuthenticationFailure() throws Exception {
        // Prepare mock error response
        mockWebServer.enqueue(new MockResponse()
            .setResponseCode(401)
            .setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .setBody("{\"error\":\"Invalid credentials\"}"));

        // Create a mock of NotificationService that will be used in the recover method
        EasyMsClientRest spyClient = new EasyMsClientRest(
            WebClient.builder().baseUrl(mockWebServer.url("/").toString()).build(),
            meterRegistry,
            notificationService
        );

        try {
            java.lang.reflect.Field loginField = EasyMsClientRest.class.getDeclaredField("login");
            loginField.setAccessible(true);
            loginField.set(spyClient, "testuser");

            java.lang.reflect.Field passwordField = EasyMsClientRest.class.getDeclaredField("password");
            passwordField.setAccessible(true);
            passwordField.set(spyClient, "testpass");
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Use the recover method directly since we can't easily trigger retry exhaustion
        Exception exception = new WebClientResponseException(
            401, "Unauthorized", HttpHeaders.EMPTY, new byte[0], null);

        // Call recover method directly
        String token = spyClient.recoverAuthenticate(exception);

        // Assert
        assertEquals(null, token);

        // Verify notification was called
        verify(notificationService, times(1)).notify(eq("easyms"), anyString());
    }
}
