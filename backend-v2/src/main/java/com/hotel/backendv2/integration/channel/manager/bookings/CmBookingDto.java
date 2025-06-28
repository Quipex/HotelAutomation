package com.hotel.backendv2.integration.channel.manager.bookings;

import java.time.Instant;
import java.util.List;

public record CmBookingDto(
    String cmId,
    String cmSource,
    String status,
    Instant bookedAt,
    Instant modifiedAt,
    String responsibleUserId,
    CmCustomerDto customer,
    List<CmBookedRoomDto> rooms
) {
}
