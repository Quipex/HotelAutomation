package com.hotel.backendservice.sync;

import com.hotel.backendservice.notification.NotificationService;
import com.hotel.backendservice.sync.dto.BookingDto;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.List;

/**
 * REST implementation of PmsClient for EasyMS
 */
@Service("easy_ms_rest_client")
@Slf4j
public class EasyMsClient implements PmsClient {

    private final RestTemplate easyMsRestTemplate;
    private final MeterRegistry registry;
    private final NotificationService notificationService;

    public EasyMsClient(@Qualifier("easyms-client") RestTemplate easyMsRestTemplate, MeterRegistry registry, NotificationService notificationService) {
        this.easyMsRestTemplate = easyMsRestTemplate;
        this.registry = registry;
        this.notificationService = notificationService;
    }

    @Override
    public List<BookingDto> getBookings(LocalDate from, LocalDate to) {
        return List.of();
    }

    @Override
    public BookingDto fetchBookingById(String pmsBookingId) {
        return null;
    }
}
