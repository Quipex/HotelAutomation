package com.hotel.backendservice.notification;

/**
 * Service for sending notifications through various channels
 */
public interface NotificationService {
    
    /**
     * Send a notification to the specified channel
     * 
     * @param channel the notification channel (e.g., "easyms", "system", "telegram")
     * @param message the notification message
     */
    void notify(String channel, String message);
} 