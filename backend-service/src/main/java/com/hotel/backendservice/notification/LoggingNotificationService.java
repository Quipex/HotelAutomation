package com.hotel.backendservice.notification;

import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

/**
 * Default implementation of NotificationService that logs notifications
 */
@Service
@Slf4j
public class LoggingNotificationService implements NotificationService {
    
    @Override
    public void notify(String channel, String message) {
        log.error("Notification [{}]: {}", channel, message);
    }
} 