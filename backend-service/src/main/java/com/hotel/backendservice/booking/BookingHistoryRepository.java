package com.hotel.backendservice.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookingHistoryRepository extends JpaRepository<BookingHistoryEntity, Long> {
  List<BookingHistoryEntity> findByBookingIdOrderByTimestampDesc(UUID bookingId);
}
