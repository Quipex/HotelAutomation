package com.hotel.backendv2.integration.channel.manager.bookings;

import java.time.Instant;
import java.util.Map;

public record CmBookedRoomDto(
    String cmRoomReservationId,
    String roomId,
    Instant arrival,
    Instant departure,
    String guestName,
    int numberOfGuests,
    int categoryId,
    int rateId,
    String status,
    String bookingAmountCurrency,
    long bookingAmountMinor,
    long paidAmountMinor,
    String notes,
    Map<String, Object> attributes
) {
}
