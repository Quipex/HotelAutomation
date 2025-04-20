package com.hotel.backendservice.notification;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notification")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class NotificationEntity {
    @Id
    private UUID id;
    
    private String channel;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    private String status;
    
    @CreationTimestamp
    private Instant createdAt;
    
    private Instant lastAttemptAt;
    
    @Column(columnDefinition = "TEXT")
    private String errorDetails;
} 