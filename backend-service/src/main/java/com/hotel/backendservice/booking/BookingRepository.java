package com.hotel.backendservice.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, UUID> {
    List<BookingEntity> findByCheckinDate(LocalDate checkinDate);
    
    List<BookingEntity> findByStatus(String status);
    
    @Query("SELECT b FROM BookingEntity b WHERE b.checkinDate = :date AND b.status NOT IN ('CANCELLED', 'COMPLETED')")
    List<BookingEntity> findArrivingBookings(@Param("date") LocalDate date);
    
    @Query("SELECT b FROM BookingEntity b WHERE b.status = 'PENDING_PAYMENT' AND b.checkinDate > :arriveAfter")
    List<BookingEntity> findNotPaidBookings(@Param("arriveAfter") LocalDate arriveAfter);
} 