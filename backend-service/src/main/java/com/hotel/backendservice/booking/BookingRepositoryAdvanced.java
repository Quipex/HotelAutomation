package com.hotel.backendservice.booking;

import java.time.LocalDate;
import java.util.List;

/**
 * Custom repository fragment for complex booking queries
 */
public interface BookingRepositoryAdvanced {

  /**
   * Search bookings with complex filtering
   *
   * @param from    The date to filter from (check-in date)
   * @param prepaid Whether the booking is prepaid or not
   * @param source  The booking source
   * @return List of matching booking DTOs
   */
  List<BookingDto> search(LocalDate from, Boolean prepaid, String source);
}
