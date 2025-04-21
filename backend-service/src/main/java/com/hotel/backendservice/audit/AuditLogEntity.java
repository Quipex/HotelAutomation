package com.hotel.backendservice.audit;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "audit_log")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AuditLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Instant timestamp = Instant.now();

    @ManyToOne
    @JoinColumn(name = "actor_id")
    private AuditActorEntity actor;

    private String action;
    private String objectType;
    private String objectId;

    @Column(columnDefinition = "jsonb")
    @Convert(converter = JsonbConverter.class)
    private String details;
}
