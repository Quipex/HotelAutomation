package com.hotel.backendv2.integration.channel.manager.bookings.easyms;

import java.util.List;

public record EasymsBookingDto(
    String id,
    long organizationId,
    EasymsCustomerDto customer,
    List<EasymsBookedRoomDto> rooms,
    String status,
    List<Object> services,
    long bookedAt,
    long modifiedAt,
    String source
) {
}
