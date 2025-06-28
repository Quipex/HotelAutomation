package com.hotel.backendv2.integration.channel.manager.bookings.easyms;

public record EasymsGuestCharges(
    double amount,
    String currency,
    boolean included,
    boolean perNight,
    boolean perPerson,
    String percentage,
    String text
) {
}
