package com.hotel.backendservice.booking;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {

    private UUID id;

    @NotNull(message = "Client ID is required")
    private UUID clientId;

    @NotNull(message = "Room ID is required")
    private UUID roomId;

    @NotNull(message = "Check-in date is required")
    private LocalDate checkinDate;

    @NotNull(message = "Check-out date is required")
    private LocalDate checkoutDate;

    @NotNull(message = "Status is required")
    @Size(min = 1, max = 50, message = "Status must be between 1 and 50 characters")
    private String status;

    private String source;

    private BigDecimal cost;

    @Size(max = 2000, message = "Notes should be less than 2000 characters")
    private String notes;

    private String sourceSystemId;

    private String channelId;

    private String channelName;
}
