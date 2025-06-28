package com.hotel.backendv2.integration.channel.manager.bookings.easyms;

import com.hotel.backendv2.integration.channel.manager.bookings.ChannelManagerAdapter;
import com.hotel.backendv2.integration.channel.manager.bookings.CmBookingDto;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;

@Component
public class EasymsAdapter implements ChannelManagerAdapter {
    private final RestTemplate client;

    public EasymsAdapter(@Qualifier("easyms-client") RestTemplate client) {
        this.client = client;
    }

    @Override
    public List<CmBookingDto> fetchBookings(LocalDate from, LocalDate to) {
        return List.of();
    }
}
