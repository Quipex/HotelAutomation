package com.hotel.backendservice.sync;

import com.hotel.backendservice.sync.dto.BookingDto;

import java.time.LocalDate;
import java.util.List;

public interface PmsClient {

    List<BookingDto> getBookings(LocalDate from, LocalDate to);

    BookingDto fetchBookingById(String pmsBookingId);
}
