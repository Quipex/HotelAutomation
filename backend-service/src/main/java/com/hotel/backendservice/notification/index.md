# Notification Package

This package contains components for sending and tracking notifications across various channels.

## Files

- **NotificationService.java** - Interface defining the core notification service functionality for sending messages
  through different channels (e.g., email, SMS, system, telegram).

- **NotificationServiceImpl.java** - Primary implementation of NotificationService that routes notifications to the
  appropriate channel-specific service based on the specified channel.

- **LoggingNotificationService.java** - Implementation of NotificationService that logs notifications to the application
  logs and database. Useful for development, testing, or as a fallback notification mechanism.

- **TelegramNotificationService.java** - Implementation of NotificationService for sending notifications through the
  Telegram Bot API to specified chat IDs.

- **NotificationStatus.java** - Enum defining possible notification statuses: SENT and FAILED.

- **NotificationEntity.java** - JPA entity representing a notification record, storing details about the notification
  message, channel, status, and error information. Allows tracking of notification delivery and failures.

- **NotificationRepository.java** - JPA repository for NotificationEntity, providing methods to retrieve notifications
  by status and creation time, enabling notification retry mechanisms and status tracking.

- **NotificationRetryJob.java** - Scheduled job that automatically retries failed notifications with a configurable
  retry policy.

- **NotificationController.java** - REST controller exposing endpoints for sending notifications and retrieving
  notification history. 
