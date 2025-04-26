package com.hotel.backendservice.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

  private final NotificationService notificationService;
  private final NotificationRepository notificationRepository;

  @PostMapping("/send")
  public ResponseEntity<Void> sendNotification(@RequestParam String channel, @RequestBody String message) {
    notificationService.notify(channel, message);
    return ResponseEntity.ok().build();
  }

  @GetMapping
  public ResponseEntity<List<NotificationEntity>> getNotifications(
    @RequestParam(required = false) NotificationStatus status) {
    if (status != null) {
      return ResponseEntity.ok(notificationRepository.findByStatusOrderByCreatedAtDesc(status));
    }
    return ResponseEntity.ok(notificationRepository.findAll());
  }
}
