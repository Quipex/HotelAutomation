package com.hotel.backendservice.sync;

import com.hotel.backendservice.notification.NotificationService;
import com.hotel.backendservice.sync.dto.AuthRequestDto;
import com.hotel.backendservice.sync.dto.AuthResponseDto;
import com.hotel.backendservice.sync.dto.BookingDto;
import io.micrometer.core.annotation.Timed;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

/**
 * REST implementation of PmsClient for EasyMS
 */
@Service("easy_ms_rest_client")
@Slf4j
public class EasyMsClientRest implements PmsClient {

    private final WebClient easyMsWebClient;
    private final MeterRegistry registry;
    private final NotificationService notificationService;

    public EasyMsClientRest(@Qualifier("easy_ms_web_client") WebClient easyMsWebClient, MeterRegistry registry, NotificationService notificationService) {
        this.easyMsWebClient = easyMsWebClient;
        this.registry = registry;
        this.notificationService = notificationService;
    }

    @Value("${easyms.auth.login}")
    private String login;

    @Value("${easyms.auth.password}")
    private String password;

    private final AtomicReference<String> authToken = new AtomicReference<>();
    private volatile Instant tokenExpiration = Instant.EPOCH;

    @Override
    public List<BookingDto> getBookings(LocalDate from, LocalDate to) {
        return List.of();
    }

    @Override
    public BookingDto fetchBookingById(String pmsBookingId) {
        return null;
    }
}
