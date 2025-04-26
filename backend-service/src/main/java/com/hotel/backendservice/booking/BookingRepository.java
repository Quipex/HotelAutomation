package com.hotel.backendservice.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Repository for booking entities with both standard JPA methods and
 * custom methods from BookingRepositoryCustom
 */
@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, UUID>, BookingRepositoryAdvanced {

  /**
   * Find bookings by check-in date
   */
  List<BookingEntity> findByCheckinDate(LocalDate checkinDate);

  /**
   * Find bookings by status
   */
  List<BookingEntity> findByStatus(String status);

  /**
   * Find arriving bookings for a specific date that are not cancelled or completed
   */
  @Query("SELECT b FROM BookingEntity b WHERE b.checkinDate = :date AND b.status NOT IN ('CANCELLED', 'COMPLETED')")
  List<BookingEntity> findArrivingBookings(@Param("date") LocalDate date);

  /**
   * Find bookings that haven't been paid for and are scheduled after a certain date
   */
  @Query("SELECT b FROM BookingEntity b WHERE b.status = 'PENDING_PAYMENT' AND b.checkinDate > :arriveAfter")
  List<BookingEntity> findNotPaidBookings(@Param("arriveAfter") LocalDate arriveAfter);
}
