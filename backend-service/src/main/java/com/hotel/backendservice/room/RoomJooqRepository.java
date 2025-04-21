package com.hotel.backendservice.room;

import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Result;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class RoomJooqRepository {

    private final DSLContext dslContext;
    private final RoomMapper roomMapper;

    /**
     * Search rooms by number
     *
     * @param number The room number pattern to search for
     * @return List of matching rooms
     */
    public List<RoomDto> searchByNumber(String number) {
        Result<Record> records = dslContext
                .select()
                .from("room")
                .where("number LIKE {0}")
                .orderBy(dslContext.field("number").asc())
                .bind(0, "%" + number + "%")
                .fetch();

        return records.stream()
                .map(record -> {
                    com.hotel.backendservice.room.RoomEntity entity = new com.hotel.backendservice.room.RoomEntity();
                    entity.setId(record.get("id", java.util.UUID.class));
                    entity.setNumber(record.get("number", String.class));
                    entity.setFloor(record.get("floor", Integer.class));
                    entity.setHasSeaView(record.get("has_sea_view", Boolean.class));
                    entity.setBalconySide(record.get("balcony_side", String.class));
                    entity.setType(record.get("type", String.class));
                    entity.setMaxAdults(record.get("max_adults", Integer.class));
                    entity.setCapacity(record.get("capacity", Integer.class));
                    entity.setNotes(record.get("notes", String.class));
                    return roomMapper.toDto(entity);
                })
                .collect(Collectors.toList());
    }

    /**
     * Find available rooms for a given date range and guest count
     *
     * @param fromDate The check-in date
     * @param numDays  The number of days of stay
     * @param guests   The number of guests
     * @return List of available rooms
     */
    public List<RoomDto> findAvailableRooms(LocalDate fromDate, int numDays, int guests) {
        LocalDate toDate = fromDate.plusDays(numDays);

        Result<Record> records = dslContext
                .select()
                .from("room r")
                .where("r.capacity >= {0}")
                .and("r.id NOT IN (SELECT b.room_id FROM booking b " +
                        "WHERE b.status NOT IN ('CANCELLED', 'COMPLETED') " +
                        "AND ((b.checkin_date >= {1} AND b.checkin_date < {2}) OR " +
                        "(b.checkout_date > {1} AND b.checkout_date <= {2}) OR " +
                        "(b.checkin_date <= {1} AND b.checkout_date >= {2})))")
                .orderBy(
                        dslContext.field("r.capacity").asc(),
                        dslContext.field("r.type").asc(),
                        dslContext.field("r.number").asc()
                )
                .bind(0, guests)
                .bind(1, fromDate)
                .bind(2, toDate)
                .fetch();

        return records.stream()
                .map(record -> {
                    com.hotel.backendservice.room.RoomEntity entity = new com.hotel.backendservice.room.RoomEntity();
                    entity.setId(record.get("id", java.util.UUID.class));
                    entity.setNumber(record.get("number", String.class));
                    entity.setFloor(record.get("floor", Integer.class));
                    entity.setHasSeaView(record.get("has_sea_view", Boolean.class));
                    entity.setBalconySide(record.get("balcony_side", String.class));
                    entity.setType(record.get("type", String.class));
                    entity.setMaxAdults(record.get("max_adults", Integer.class));
                    entity.setCapacity(record.get("capacity", Integer.class));
                    entity.setNotes(record.get("notes", String.class));
                    return roomMapper.toDto(entity);
                })
                .collect(Collectors.toList());
    }
}
