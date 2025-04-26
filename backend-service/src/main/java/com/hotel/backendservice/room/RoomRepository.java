package com.hotel.backendservice.room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoomRepository extends JpaRepository<RoomEntity, UUID> {
  Optional<RoomEntity> findByNumber(String number);

  /**
   * Search rooms by number using LIKE pattern
   *
   * @param number The room number pattern to search for
   * @return List of matching room entities
   */
  @Query(value = "SELECT * FROM room WHERE number LIKE %:number% ORDER BY number ASC",
    nativeQuery = true)
  List<RoomEntity> findByNumberContaining(@Param("number") String number);

  /**
   * Find available rooms for a given date range and guest count
   *
   * @param fromDate The check-in date
   * @param toDate   The check-out date
   * @param guests   The number of guests
   * @return List of available room entities
   */
  @Query(value = "SELECT r.* FROM room r " +
    "WHERE r.capacity >= :guests " +
    "AND r.id NOT IN (" +
    "    SELECT b.room_id FROM booking b " +
    "    WHERE b.status NOT IN ('CANCELLED', 'COMPLETED') " +
    "    AND ((b.checkin_date >= :fromDate AND b.checkin_date < :toDate) OR " +
    "         (b.checkout_date > :fromDate AND b.checkout_date <= :toDate) OR " +
    "         (b.checkin_date <= :fromDate AND b.checkout_date >= :toDate))" +
    ") " +
    "ORDER BY r.capacity ASC, r.type ASC, r.number ASC",
    nativeQuery = true)
  List<RoomEntity> findAvailableRooms(
    @Param("fromDate") LocalDate fromDate,
    @Param("toDate") LocalDate toDate,
    @Param("guests") int guests);

  /**
   * Find available rooms as DTO projections for a given date range and guest count
   *
   * @param fromDate The check-in date
   * @param toDate   The check-out date
   * @param guests   The number of guests
   * @return List of available room DTOs with specific projection
   */
  @Query(value =
    "SELECT r.id        AS room_id,  " +
      "       r.number    AS number,   " +
      "       r.type      AS type,     " +
      "       r.capacity  AS capacity, " +
      "       r.floor     AS floor,    " +
      "       r.has_sea_view AS has_sea_view " +
      "FROM room r " +
      "WHERE r.capacity >= :guests " +
      "  AND NOT EXISTS ( " +
      "    SELECT 1 FROM booking b " +
      "    WHERE b.room_id = r.id " +
      "      AND NOT (b.checkout_date < :fromDate OR b.checkin_date > :toDate) " +
      ")",
    nativeQuery = true)
  List<RoomAvailabilityDto> findAvailableRoomsProjection(
    @Param("fromDate") LocalDate fromDate,
    @Param("toDate") LocalDate toDate,
    @Param("guests") int guests
  );
}
