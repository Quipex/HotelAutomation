package com.hotel.backendservice.booking;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "booking_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingHistoryEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "booking_id")
  private BookingEntity booking;

  private String field;
  private String oldValue;
  private String newValue;

  @Column(nullable = false)
  private Instant timestamp = Instant.now();
}
