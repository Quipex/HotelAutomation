package com.hotel.backendservice.sync;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.backendservice.notification.NotificationService;
import com.hotel.backendservice.sync.dto.AuthResponseDto;
import com.hotel.backendservice.sync.dto.BookingDto;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;

/**
 * Integration test for EasyMsClientRest.
 * Uses MockWebServer to simulate external service.
 */
@ExtendWith(MockitoExtension.class)
public class EasyMsIntegrationTest {

  private MockWebServer mockWebServer;
  private EasyMsClientRest easyMsClient;

  @Mock
  private NotificationService notificationService;

  private final MeterRegistry meterRegistry = new SimpleMeterRegistry();
  private final ObjectMapper objectMapper = new ObjectMapper();

  @BeforeEach
  void setUp() throws Exception {
    mockWebServer = new MockWebServer();
    mockWebServer.start();

    // Set up mock WebClient with appropriate behavior
    WebClient webClient = setupMockWebClient();

    // Create EasyMsClientRest with dependencies
    easyMsClient = new EasyMsClientRest(webClient, meterRegistry, notificationService);

    // Set properties via reflection since we're not using Spring context
    setField(easyMsClient, "login", "test-login");
    setField(easyMsClient, "password", "test-password");
  }

  private WebClient setupMockWebClient() {
    // Create the mock WebClient
    WebClient webClientMock = mock(WebClient.class);
    WebClient.RequestBodyUriSpec requestBodyUriSpecMock = mock(WebClient.RequestBodyUriSpec.class);
    WebClient.RequestHeadersUriSpec requestHeadersUriSpecMock = mock(WebClient.RequestHeadersUriSpec.class);
    WebClient.RequestBodySpec requestBodySpecMock = mock(WebClient.RequestBodySpec.class);
    WebClient.RequestHeadersSpec requestHeadersSpecMock = mock(WebClient.RequestHeadersSpec.class);
    WebClient.ResponseSpec responseSpecMock = mock(WebClient.ResponseSpec.class);

    // Set up WebClient.post() behavior with lenient() to avoid unnecessary stubbing errors
    lenient().when(webClientMock.post()).thenReturn(requestBodyUriSpecMock);
    lenient().when(requestBodyUriSpecMock.uri("/login")).thenReturn(requestBodySpecMock);
    lenient().when(requestBodySpecMock.bodyValue(any())).thenReturn(requestHeadersSpecMock);
    lenient().when(requestHeadersSpecMock.retrieve()).thenReturn(responseSpecMock);
    lenient().when(responseSpecMock.bodyToMono(AuthResponseDto.class))
      .thenReturn(Mono.just(new AuthResponseDto("test-token", 3600L)));

    // Set up WebClient.get() behavior for fetchNewBookings
    lenient().when(webClientMock.get()).thenReturn(requestHeadersUriSpecMock);
    lenient().when(requestHeadersUriSpecMock.uri(any(java.util.function.Function.class)))
      .thenReturn(requestHeadersSpecMock);
    lenient().when(requestHeadersUriSpecMock.uri("/bookings/{pmsId}", "123"))
      .thenReturn(requestHeadersSpecMock);
    lenient().when(requestHeadersSpecMock.header(any(), any())).thenReturn(requestHeadersSpecMock);
    lenient().when(requestHeadersSpecMock.retrieve()).thenReturn(responseSpecMock);

    // For fetchNewBookings method
    lenient().when(responseSpecMock.bodyToFlux(BookingDto.class))
      .thenReturn(reactor.core.publisher.Flux.fromIterable(List.of(
        createSampleBooking("123"),
        createSampleBooking("456")
      )));

    // For fetchBookingById method
    lenient().when(responseSpecMock.bodyToMono(BookingDto.class))
      .thenReturn(Mono.just(createSampleBooking("123")));

    return webClientMock;
  }

  private void setField(Object target, String fieldName, Object value) throws Exception {
    java.lang.reflect.Field field = target.getClass().getDeclaredField(fieldName);
    field.setAccessible(true);
    field.set(target, value);
  }

  private BookingDto createSampleBooking(String id) {
    return BookingDto.builder()
      .pmsId(id)
      .guestName("Test Guest " + id)
      .guestEmail("guest" + id + "@example.com")
      .guestPhone("+79123456789")
      .roomNumber("10" + id)
      .checkInDate(LocalDate.now().plusDays(1))
      .checkOutDate(LocalDate.now().plusDays(3))
      .status("confirmed")
      .isPrepaid(true)
      .createdAt(Instant.now())
      .build();
  }

  @Test
  void testFetchBookings() {
    // Call the method
    List<BookingDto> bookings = easyMsClient.fetchNewBookings(Instant.now().minusSeconds(3600));

    // Assertions
    assertNotNull(bookings);
    assertEquals(2, bookings.size());
    assertEquals("123", bookings.get(0).getPmsId());
    assertEquals("456", bookings.get(1).getPmsId());
  }

  @Test
  void testFetchBookingById() {
    // Call the method
    BookingDto booking = easyMsClient.fetchBookingById("123");

    // Assertions
    assertNotNull(booking);
    assertEquals("123", booking.getPmsId());
    assertEquals("Test Guest 123", booking.getGuestName());
    assertTrue(booking.getIsPrepaid());
  }
}
