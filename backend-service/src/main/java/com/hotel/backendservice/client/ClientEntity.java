package com.hotel.backendservice.client;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "client")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ClientEntity {
    @Id
    private UUID id;

    private String firstName;
    private String lastName;
    private String middleName;

    @Column(name = "full_name", insertable = false, updatable = false)
    private String fullName;

    @Column(columnDefinition = "text[]")
    private String[] phones;

    private String email;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
