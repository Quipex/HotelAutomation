package com.hotel.backendservice.sync;

import com.hotel.backendservice.sync.dto.BookingDto;

import java.time.Instant;
import java.util.List;

/**
 * Interface for communication with a Property Management System (PMS)
 */
public interface PmsClient {

  /**
   * Authenticate with the PMS
   *
   * @return authentication token
   */
  String authenticate();

  /**
   * Fetch new bookings since the specified time
   *
   * @param since time from which to fetch bookings
   * @return list of new bookings
   */
  List<BookingDto> fetchNewBookings(Instant since);

  /**
   * Fetch a specific booking by its PMS ID
   *
   * @param pmsId the ID of the booking in the PMS
   * @return the booking details
   */
  BookingDto fetchBookingById(String pmsId);
}
