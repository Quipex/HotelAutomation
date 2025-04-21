package com.hotel.backendservice.sync.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for booking information from EasyMS PMS
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    
    private String pmsId;
    private String guestName;
    private String guestEmail;
    private String guestPhone;
    private String roomNumber;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BigDecimal totalAmount;
    private String status;
    private String source;
    private Instant createdAt;
    private Boolean isPrepaid;
    private String notes;
} 