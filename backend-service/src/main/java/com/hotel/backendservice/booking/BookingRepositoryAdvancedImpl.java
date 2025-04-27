package com.hotel.backendservice.booking;

import com.hotel.backendservice.client.ClientEntity;
import com.hotel.backendservice.room.RoomEntity;
import lombok.RequiredArgsConstructor;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Result;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the custom repository fragment using jOOQ
 */
@Repository
@RequiredArgsConstructor
public class BookingRepositoryAdvancedImpl implements BookingRepositoryAdvanced {

    private final DSLContext dslContext;
    private final BookingMapper bookingMapper;

    @Override
    public List<BookingDto> search(LocalDate from, Boolean prepaid, String source) {
        List<Condition> conditions = new ArrayList<>();

        if (from != null) {
            conditions.add(DSL.field("checkin_date").greaterOrEqual(from));
        }

        if (prepaid != null) {
            if (prepaid) {
                conditions.add(DSL.field("status").eq("PAID"));
            } else {
                conditions.add(DSL.field("status").eq("PENDING_PAYMENT"));
            }
        }

        if (source != null && !source.isBlank()) {
            conditions.add(DSL.field("source").eq(source));
        }

        Result<Record> records = dslContext
            .select()
            .from("booking b")
            .join("client c").on("b.client_id = c.id")
            .join("room r").on("b.room_id = r.id")
            .where(conditions)
            .orderBy(DSL.field("checkin_date").asc())
            .fetch();

        return mapToBookingDtos(records);
    }

    private List<BookingDto> mapToBookingDtos(Result<Record> records) {
        return records.stream()
            .map(record -> {
                BookingEntity entity = new BookingEntity();
                entity.setId(record.get("b.id", java.util.UUID.class));

                ClientEntity client = new ClientEntity();
                client.setId(record.get("c.id", java.util.UUID.class));
                entity.setClient(client);

                RoomEntity room = new RoomEntity();
                room.setId(record.get("r.id", java.util.UUID.class));
                entity.setRoom(room);

                entity.setCheckinDate(record.get("b.checkin_date", LocalDate.class));
                entity.setCheckoutDate(record.get("b.checkout_date", LocalDate.class));
                entity.setStatus(record.get("b.status", String.class));
                entity.setSource(record.get("b.source", String.class));
                entity.setCost(record.get("b.cost", java.math.BigDecimal.class));
                entity.setNotes(record.get("b.notes", String.class));
                entity.setSourceSystemId(record.get("b.source_system_id", String.class));
                entity.setChannelId(record.get("b.channel_id", String.class));
                entity.setChannelName(record.get("b.channel_name", String.class));
                entity.setCreatedAt(record.get("b.created_at", java.time.Instant.class));
                entity.setUpdatedAt(record.get("b.updated_at", java.time.Instant.class));

                return bookingMapper.toDto(entity);
            })
            .collect(Collectors.toList());
    }
}
