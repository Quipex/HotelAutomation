package com.hotel.backendservice.sync;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "sync_status")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SyncStatusEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Instant lastSyncAt;
    private String status;
    private Long duration;
    
    @Column(columnDefinition = "TEXT")
    private String details;
} 