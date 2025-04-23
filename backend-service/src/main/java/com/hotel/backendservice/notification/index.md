# Notification Package

This package contains components for sending and tracking notifications across various channels.

## Files

- **NotificationService.java** - Interface defining the core notification service functionality for sending messages through different channels (e.g., email, SMS, system).

- **LoggingNotificationService.java** - Default implementation of NotificationService that logs notifications to the application logs. Useful for testing or as a fallback notification mechanism.

- **NotificationEntity.java** - JPA entity representing a notification record, storing details about the notification message, channel, status, and error information. Allows tracking of notification delivery and failures.

- **NotificationRepository.java** - JPA repository for NotificationEntity, providing methods to retrieve notifications by status and creation time, enabling notification retry mechanisms and status tracking. 