package com.hotel.backendservice.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.Instant;

/**
 * Simple implementation of NotificationService that logs notifications
 * and saves them to the database but doesn't send them to external systems.
 * Useful for development and testing.
 */
@Service
@Qualifier("logging")
@Slf4j
@RequiredArgsConstructor
public class LoggingNotificationService implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public void notify(String channel, String message) {
        log.info("Notification [{}]: {}", channel, message);

        // Create and save notification entity
        NotificationEntity notification = new NotificationEntity();
        notification.setChannel(channel);
        notification.setMessage(message);
        notification.setStatus(NotificationStatus.SENT); // Always mark as sent
        notification.setCreatedAt(Instant.now());
        notification.setLastAttemptAt(Instant.now());

        notificationRepository.save(notification);
    }
}
