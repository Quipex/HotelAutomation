package com.hotel.backendservice.notification;

import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

/**
 * Primary implementation of the NotificationService that routes notifications
 * to the appropriate channel-specific service.
 */
@Service
@Primary
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    @Qualifier("telegram")
    private final NotificationService telegramNotificationService;

    @Qualifier("logging")
    private final NotificationService loggingNotificationService;

    private final MeterRegistry meterRegistry;

    public NotificationServiceImpl(NotificationService telegramNotificationService, NotificationService loggingNotificationService, MeterRegistry meterRegistry) {
        this.telegramNotificationService = telegramNotificationService;
        this.loggingNotificationService = loggingNotificationService;
        this.meterRegistry = meterRegistry;
    }

    @Override
    public void notify(String channel, String message) {
        log.debug("Routing notification to channel: {}", channel);
        meterRegistry.counter("notifications.requests", "channel", channel).increment();

        try {
            switch (channel.toLowerCase()) {
                case "telegram":
                    telegramNotificationService.notify(channel, message);
                    break;
                default:
                    // Fall back to logging service for unsupported channels
                    log.warn("No specific handler for channel '{}', using logging service", channel);
                    loggingNotificationService.notify(channel, message);
                    break;
            }
        } catch (Exception e) {
            log.error("Error routing notification", e);
            // If routing fails, try to at least log the notification
            loggingNotificationService.notify(channel,
                "Failed to route notification: " + e.getMessage() + ". Original message: " + message);
        }
    }
}
