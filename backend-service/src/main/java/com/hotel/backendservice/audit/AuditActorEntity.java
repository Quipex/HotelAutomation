package com.hotel.backendservice.audit;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "audit_actor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditActorEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String platform;
  private String userId;
  private String userName;
  private String userNick;
  private String userAgent;
  private String ipAddress;

  @CreationTimestamp
  private Instant createdAt;
}
