package com.hotel.backendv2.integration.channel.manager.bookings.easyms;

import java.util.List;

public record EasymsBookedRoomDto(
    String roomReservationId,
    String roomId,
    long categoryId,
    long arrival,
    long departure,
    String guestName,
    List<Object> addOns,
    int numberOfGuests,
    List<EasymsGuestCharges> guestExtraCharges,
    String remarks,
    long rateId,
    String status,
    String currencyCode,
    double invoice,
    double paid,
    boolean locked,
    boolean detailed
) {
}
