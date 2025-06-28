package com.hotel.backendv2.integration.channel.manager.bookings;

import java.time.LocalDate;
import java.util.List;

public interface ChannelManagerAdapter {
    List<CmBookingDto> fetchBookings(LocalDate from, LocalDate to);
}
