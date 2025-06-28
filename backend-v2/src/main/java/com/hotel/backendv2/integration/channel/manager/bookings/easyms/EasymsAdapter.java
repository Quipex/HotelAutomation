package com.hotel.backendv2.integration.channel.manager.bookings.easyms;

import com.hotel.backendv2.integration.channel.manager.bookings.ChannelManagerAdapter;
import com.hotel.backendv2.integration.channel.manager.bookings.CmBookingDto;

import java.time.LocalDate;
import java.util.List;

public class EasymsAdapter implements ChannelManagerAdapter {
    @Override
    public List<CmBookingDto> fetchBookings(LocalDate from, LocalDate to) {
        return List.of();
    }
}
