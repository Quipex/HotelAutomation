package com.hotel.backendv2.integration.channel.manager.bookings.easyms;

public record EasymsCustomerDto(
    String name,
    String address,
    String city,
    String countryCode,
    String email,
    String telephone,
    String zip,
    String remarks,
    String ccName,
    String ccNumber,
    String ccExpirationDate
) {
}
