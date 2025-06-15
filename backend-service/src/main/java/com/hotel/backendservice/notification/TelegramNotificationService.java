package com.hotel.backendservice.notification;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Instant;

@Service
@Qualifier("telegram")
@Slf4j
public class TelegramNotificationService implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final WebClient webClient;
    private final MeterRegistry meterRegistry;

    @Value("${notification.telegram.bot-token}")
    private String botToken;

    @Value("${notification.telegram.admin-chat-id}")
    private String adminChatId;

    // Flag to disable admin alerts during testing
    @Setter
    private boolean adminAlertsEnabled = true;

    public TelegramNotificationService(NotificationRepository notificationRepository,
                                       @Qualifier("easy_ms_web_client") WebClient webClient,
                                       MeterRegistry meterRegistry) {
        this.notificationRepository = notificationRepository;
        this.webClient = webClient;
        this.meterRegistry = meterRegistry;
    }

    @Override
    public void notify(String channel, String message) {
        log.debug("Sending notification via channel {}: {}", channel, message);

        // Create notification entity
        NotificationEntity notification = new NotificationEntity();
        notification.setChannel(channel);
        notification.setMessage(message);
        notification.setCreatedAt(Instant.now());

        if (!"telegram".equals(channel)) {
            // Currently, only supporting telegram
            log.warn("Unsupported notification channel: {}", channel);
            notification.setStatus(NotificationStatus.FAILED);
            notification.setErrorDetails("Unsupported notification channel");
            notification.setLastAttemptAt(Instant.now());
            notificationRepository.save(notification);
            return;
        }

        try {
            Timer.Sample sample = Timer.start(meterRegistry);
            boolean success = sendTelegramMessage(message);
            long duration = sample.stop(
                Timer.builder("notifications.duration")
                    .tag("channel", channel)
                    .register(meterRegistry));

            notification.setLastAttemptAt(Instant.now());

            if (success) {
                notification.setStatus(NotificationStatus.SENT);
                meterRegistry.counter("notifications.sent", "channel", channel).increment();
            } else {
                notification.setStatus(NotificationStatus.FAILED);
                notification.setErrorDetails("Failed to send message to Telegram");
                meterRegistry.counter("notifications.failed", "channel", channel).increment();

                // Alert admin about the failure, but only if this is not an admin alert already
                // and admin alerts are enabled
                if (adminAlertsEnabled && !message.startsWith("Ошибка уведомления")) {
                    String alertMessage = "Ошибка уведомления " + notification.getId() + ": " + notification.getErrorDetails();
                    notify("telegram", alertMessage);
                }
            }
        } catch (Exception e) {
            log.error("Error sending telegram notification", e);
            notification.setStatus(NotificationStatus.FAILED);
            notification.setErrorDetails(e.getMessage());
            notification.setLastAttemptAt(Instant.now());
            meterRegistry.counter("notifications.failed", "channel", channel).increment();

            // Alert admin about the failure, but only if this is not an admin alert already
            // and admin alerts are enabled
            if (adminAlertsEnabled && !message.startsWith("Ошибка уведомления")) {
                String alertMessage = "Ошибка уведомления " + notification.getId() + ": " + e.getMessage();
                notify("telegram", alertMessage);
            }
        } finally {
            // Save the notification entity
            notificationRepository.save(notification);
        }
    }

    private boolean sendTelegramMessage(String message) {
        try {
            // Telegram Bot API URL
            String url = "https://api.telegram.org/bot" + botToken + "/sendMessage";

            // Create request payload
            TelegramMessageRequest requestBody = new TelegramMessageRequest(
                adminChatId,
                message,
                "HTML"
            );

            // Make the request using WebClient
            Boolean success = webClient.post()
                .uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status != HttpStatus.OK,
                    clientResponse -> Mono.error(
                        new RuntimeException("Failed to send Telegram message. Status: " + clientResponse.statusCode())
                    )
                )
                .bodyToMono(String.class)
                .map(response -> true)
                .onErrorReturn(false)
                .block();

            return success != null && success;
        } catch (Exception e) {
            log.error("Error sending Telegram message", e);
            // Rethrow the exception to allow the calling method to handle it
            throw e;
        }
    }

    // Inner class to represent the Telegram message request
    private record TelegramMessageRequest(String chat_id, String text, String parse_mode) {
    }
}
