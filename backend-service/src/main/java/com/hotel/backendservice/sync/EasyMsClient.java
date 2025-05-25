package com.hotel.backendservice.sync;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.backendservice.notification.NotificationService;
import com.hotel.backendservice.sync.dto.BookingDto;
import com.hotel.backendservice.sync.easyms.DateConverter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.Collections;
import java.util.List;

import static org.springframework.web.util.UriComponentsBuilder.fromUriString;

/**
 * REST implementation of PmsClient for EasyMS
 */
@Service("easy_ms_rest_client")
@Slf4j
public class EasyMsClient implements PmsClient {

    private final RestTemplate easyMsRestTemplate;
    private final MeterRegistry registry;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @Value("${easyms.base-url}")
    private String baseUrl;

    @Value("${easyms.organization-id}")
    private Integer organizationId;

    @Value("${easyms.sync.start-month}")
    private int startMonth;

    @Value("${easyms.sync.end-month}")
    private int endMonth;

    @Autowired
    public EasyMsClient(
            @Qualifier("easyms-client") RestTemplate easyMsRestTemplate,
            MeterRegistry registry,
            NotificationService notificationService) {
        this.easyMsRestTemplate = easyMsRestTemplate;
        this.registry = registry;
        this.notificationService = notificationService;
        this.objectMapper = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public List<BookingDto> getBookings(LocalDate from, LocalDate to) {
        Timer.Sample sample = Timer.start(registry);

        try {
            var url = getBookingsUrl(from, to);

            log.info("Fetching bookings from EasyMS: {}", url);

            var response = easyMsRestTemplate.getForEntity(url, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.warn("Received non-success response from EasyMS: {}", response.getStatusCode());
                notificationService.notify("telegram", "Received non-success response from EasyMS: " + response.getStatusCode());
                return Collections.emptyList();
            }

            try {
                // Parse the JSON response to BookingDto objects
                List<BookingDto> bookings = objectMapper.readValue(response.getBody(), new TypeReference<>() {
                });

                log.info("Successfully fetched {} bookings from EasyMS", bookings.size());

                // Record the timing
                sample.stop(Timer.builder("easyms.bookings.fetch")
                        .description("Time taken to fetch bookings from EasyMS")
                        .register(registry));

                return bookings;
            } catch (JsonProcessingException e) {
                // Send notification about data structure mismatch but return empty list instead of failing
                String errorMessage = "Error parsing EasyMS response: " + e.getMessage();
                log.error(errorMessage, e);
                notificationService.notify("telegram", errorMessage);
                return Collections.emptyList();
            }
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            String errorMessage = "Error fetching bookings from EasyMS: " + e.getMessage();
            log.error(errorMessage, e);
            notificationService.notify("telegram", errorMessage);
            return Collections.emptyList();
        } catch (Exception e) {
            String errorMessage = "Unexpected error fetching bookings from EasyMS: " + e.getMessage();
            log.error(errorMessage, e);
            notificationService.notify("telegram", errorMessage);
            return Collections.emptyList();
        }
    }

    private String getBookingsUrl(LocalDate from, LocalDate to) {
        // Calculate date range for the current year
        int currentYear = Year.now().getValue();
        LocalDate startDate = from != null ? from : LocalDate.of(currentYear, startMonth, 1);
        LocalDate endDate = to != null ? to : LocalDate.of(currentYear, endMonth, Month.of(endMonth).length(Year.isLeap(currentYear)));

        // Build URL with query parameters
        return fromUriString(baseUrl + "/orders")
                .queryParam("startTime", DateConverter.convertToEpochMilli(startDate))
                .queryParam("endTime", DateConverter.convertToEpochMilli(endDate))
                .queryParam("organizationId", organizationId)
                .build()
                .toUriString();
    }

    @Override
    public BookingDto fetchBookingById(String pmsBookingId) {
        return null;
    }
}
