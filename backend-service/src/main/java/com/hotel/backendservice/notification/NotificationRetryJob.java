package com.hotel.backendservice.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class NotificationRetryJob {

    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    @Value("${notification.retry.max-retries}")
    private int maxRetryCount;

    @Value("${notification.retry.retry-threshold-minutes}")
    private int retryThresholdMinutes;

    /**
     * Scheduled job to retry failed notifications
     * Runs based on configured interval
     */
    @Scheduled(fixedRateString = "${notification.retry.interval-minutes:15}m")
    public void retryFailedNotifications() {
        log.info("Starting notification retry job");

        List<NotificationEntity> failedNotifications = notificationRepository.findByStatusRaw(NotificationStatus.FAILED.name());
        int retryCount = 0;

        for (NotificationEntity notification : failedNotifications) {
            // Skip if we've already retried too many times (based on time between attempts)
            if (hasExceededRetryLimit(notification)) {
                continue;
            }

            log.info("Retrying notification: {}", notification.getId());
            notificationService.notify(notification.getChannel(), notification.getMessage());
            retryCount++;
        }

        log.info("Notification retry job completed. Retried {} notifications.", retryCount);
    }

    private boolean hasExceededRetryLimit(NotificationEntity notification) {
        if (notification.getLastAttemptAt() == null) {
            return false;
        }

        Duration timeSinceCreation = Duration.between(notification.getCreatedAt(), Instant.now());
        Duration timeSinceLastAttempt = Duration.between(notification.getLastAttemptAt(), Instant.now());
        Duration retryThreshold = Duration.ofMinutes(retryThresholdMinutes);

        // Count retries as number of threshold intervals since creation
        long estimatedRetryCount = timeSinceCreation.toMinutes() / retryThreshold.toMinutes();

        // If we've retried too many times or the last attempt was too recent, skip
        return estimatedRetryCount >= maxRetryCount || timeSinceLastAttempt.compareTo(retryThreshold) < 0;
    }
}
