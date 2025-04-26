package com.hotel.backendservice.sync;

import com.hotel.backendservice.notification.NotificationService;
import com.hotel.backendservice.sync.dto.AuthRequestDto;
import com.hotel.backendservice.sync.dto.AuthResponseDto;
import com.hotel.backendservice.sync.dto.BookingDto;
import io.micrometer.core.annotation.Timed;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

/**
 * REST implementation of PmsClient for EasyMS
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class EasyMsClientRest implements PmsClient {

  private final WebClient easyMsWebClient;
  private final MeterRegistry registry;
  private final NotificationService notificationService;

  @Value("${easyms.auth.login}")
  private String login;

  @Value("${easyms.auth.password}")
  private String password;

  private final AtomicReference<String> authToken = new AtomicReference<>();
  private volatile Instant tokenExpiration = Instant.EPOCH;

  @Override
  @Timed("easyms.authenticate")
  @Retryable(retryFor = {WebClientResponseException.class},
    maxAttemptsExpression = "${easyms.retry.max-attempts}",
    backoff = @Backoff(delayExpression = "${easyms.retry.backoff-delay}"))
  public String authenticate() {
    if (authToken.get() != null && Instant.now().isBefore(tokenExpiration)) {
      return authToken.get();
    }

    log.info("Authenticating with EasyMS");

    try {
      Timer.Sample sample = Timer.start(registry);

      AuthResponseDto response = easyMsWebClient.post()
        .uri("/login")
        .bodyValue(new AuthRequestDto(login, password))
        .retrieve()
        .bodyToMono(AuthResponseDto.class)
        .block();

      sample.stop(registry.timer("easyms.call.duration", "endpoint", "authenticate"));
      registry.counter("easyms.calls", "endpoint", "authenticate", "status", "success").increment();

      if (response != null && response.getToken() != null) {
        authToken.set(response.getToken());
        tokenExpiration = Instant.now().plusSeconds(response.getExpiresIn());
        return response.getToken();
      } else {
        throw new RuntimeException("Failed to get authentication token from EasyMS");
      }
    } catch (WebClientResponseException e) {
      registry.counter("easyms.calls", "endpoint", "authenticate", "status", "error").increment();
      log.error("Authentication error: {}", e.getMessage());
      throw e;
    } catch (Exception e) {
      registry.counter("easyms.calls", "endpoint", "authenticate", "status", "error").increment();
      log.error("Unexpected error during authentication: {}", e.getMessage(), e);
      throw new RuntimeException("Failed to authenticate with EasyMS: " + e.getMessage(), e);
    }
  }

  @Recover
  public String recoverAuthenticate(Exception e) {
    notificationService.notify("easyms", "Authentication error with EasyMS: " + e.getMessage());
    log.error("Authentication recovery triggered after retries exhausted: {}", e.getMessage());
    return null;
  }

  @Override
  @Retryable(retryFor = {WebClientResponseException.class},
    maxAttemptsExpression = "${easyms.retry.max-attempts}",
    backoff = @Backoff(delayExpression = "${easyms.retry.backoff-delay}"))
  public List<BookingDto> fetchNewBookings(Instant since) {
    log.info("Fetching new bookings since {}", since);

    Timer.Sample sample = Timer.start(registry);

    try {
      String token = ensureAuthenticated();

      List<BookingDto> bookings = easyMsWebClient.get()
        .uri(uriBuilder -> uriBuilder
          .path("/bookings")
          .queryParam("since", since.toString())
          .build())
        .header("Authorization", "Bearer " + token)
        .retrieve()
        .bodyToFlux(BookingDto.class)
        .collectList()
        .block();

      registry.counter("easyms.calls", "endpoint", "fetchNewBookings", "status", "success").increment();

      return bookings != null ? bookings : Collections.emptyList();
    } catch (WebClientResponseException e) {
      registry.counter("easyms.calls", "endpoint", "fetchNewBookings", "status", "error").increment();

      if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
        log.info("Token expired, re-authenticating...");
        authToken.set(null);
        throw e; // Will retry with new auth
      }

      log.error("Error fetching bookings: {}", e.getMessage());
      throw e;
    } catch (Exception e) {
      registry.counter("easyms.calls", "endpoint", "fetchNewBookings", "status", "error").increment();
      log.error("Unexpected error fetching bookings: {}", e.getMessage(), e);
      throw new RuntimeException("Failed to fetch bookings: " + e.getMessage(), e);
    } finally {
      sample.stop(registry.timer("easyms.call.duration", "endpoint", "fetchNewBookings"));
    }
  }

  @Recover
  public List<BookingDto> recoverFetchNewBookings(Exception e, Instant since) {
    notificationService.notify("easyms", "Error fetching new bookings from EasyMS: " + e.getMessage());
    log.error("Bookings fetch recovery triggered after retries exhausted: {}", e.getMessage());
    return Collections.emptyList();
  }

  @Override
  @Retryable(retryFor = {WebClientResponseException.class},
    maxAttemptsExpression = "${easyms.retry.max-attempts}",
    backoff = @Backoff(delayExpression = "${easyms.retry.backoff-delay}"))
  public BookingDto fetchBookingById(String pmsId) {
    log.info("Fetching booking with pmsId: {}", pmsId);

    Timer.Sample sample = Timer.start(registry);

    try {
      String token = ensureAuthenticated();

      BookingDto booking = easyMsWebClient.get()
        .uri("/bookings/{pmsId}", pmsId)
        .header("Authorization", "Bearer " + token)
        .retrieve()
        .bodyToMono(BookingDto.class)
        .block();

      registry.counter("easyms.calls", "endpoint", "fetchBookingById", "status", "success").increment();

      return booking;
    } catch (WebClientResponseException e) {
      registry.counter("easyms.calls", "endpoint", "fetchBookingById", "status", "error").increment();

      if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
        log.info("Token expired, re-authenticating...");
        authToken.set(null);
        throw e; // Will retry with new auth
      }

      log.error("Error fetching booking {}: {}", pmsId, e.getMessage());
      throw e;
    } catch (Exception e) {
      registry.counter("easyms.calls", "endpoint", "fetchBookingById", "status", "error").increment();
      log.error("Unexpected error fetching booking {}: {}", pmsId, e.getMessage(), e);
      throw new RuntimeException("Failed to fetch booking: " + e.getMessage(), e);
    } finally {
      sample.stop(registry.timer("easyms.call.duration", "endpoint", "fetchBookingById"));
    }
  }

  @Recover
  public BookingDto recoverFetchBookingById(Exception e, String pmsId) {
    notificationService.notify("easyms", "Error fetching booking from EasyMS: " + e.getMessage());
    log.error("Booking fetch recovery triggered after retries exhausted for pmsId {}: {}", pmsId, e.getMessage());
    return null;
  }

  /**
   * Ensure we have a valid authentication token
   *
   * @return the current valid token
   */
  private String ensureAuthenticated() {
    if (authToken.get() == null || Instant.now().isAfter(tokenExpiration)) {
      return authenticate();
    }
    return authToken.get();
  }
}
