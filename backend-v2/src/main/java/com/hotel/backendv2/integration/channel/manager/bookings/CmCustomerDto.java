package com.hotel.backendv2.integration.channel.manager.bookings;

public record CmCustomerDto(
    String name,
    String address,
    String city,
    String countryCode,
    String email,
    String telephone,
    String notes,
    String zip
) {
}
