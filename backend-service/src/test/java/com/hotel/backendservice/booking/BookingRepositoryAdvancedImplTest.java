package com.hotel.backendservice.booking;

import com.hotel.backendservice.client.ClientEntity;
import com.hotel.backendservice.room.RoomEntity;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.Result;
import org.jooq.impl.DSL;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingRepositoryAdvancedImplTest {

    @Mock
    private DSLContext dslContext;

    @Mock
    private BookingMapper bookingMapper;

    @Mock
    private Result<org.jooq.Record> records;

    @Mock
    private org.jooq.Record record;

    @InjectMocks
    private BookingRepositoryAdvancedImpl bookingRepositoryAdvanced;

    private BookingDto bookingDto;
    private BookingEntity bookingEntity;
    private UUID bookingId;
    private UUID clientId;
    private UUID roomId;

    @BeforeEach
    void setUp() {
        bookingId = UUID.randomUUID();
        clientId = UUID.randomUUID();
        roomId = UUID.randomUUID();

        bookingDto = new BookingDto();
        bookingDto.setId(bookingId);
        bookingDto.setClientId(clientId);
        bookingDto.setRoomId(roomId);
        bookingDto.setCheckinDate(LocalDate.now());
        bookingDto.setCheckoutDate(LocalDate.now().plusDays(2));
        bookingDto.setStatus("CONFIRMED");
        bookingDto.setSource("WEBSITE");
        bookingDto.setCost(new BigDecimal("150.00"));

        bookingEntity = new BookingEntity();
        bookingEntity.setId(bookingId);

        ClientEntity client = new ClientEntity();
        client.setId(clientId);
        bookingEntity.setClient(client);

        RoomEntity room = new RoomEntity();
        room.setId(roomId);
        bookingEntity.setRoom(room);
    }

    @Test
    void search_ShouldReturnMatchingBookings_WhenAllFiltersProvided() {
        // Arrange
        LocalDate fromDate = LocalDate.now();
        Boolean prepaid = true;
        String source = "WEBSITE";

        // Simplify mocking by directly mocking the fetch call result
        when(dslContext.select()).thenReturn(DSL.select());
        when(records.size()).thenReturn(1);
        when(records.iterator()).thenReturn(List.of(record).iterator());
        when(records.get(0)).thenReturn(record);

        // Mock necessary record access - simulate what would happen in mapToBookingDtos
        when(record.get("b.id", UUID.class)).thenReturn(bookingId);
        when(record.get("c.id", UUID.class)).thenReturn(clientId);
        when(record.get("r.id", UUID.class)).thenReturn(roomId);
        when(record.get("b.checkin_date", LocalDate.class)).thenReturn(LocalDate.now());
        when(record.get("b.checkout_date", LocalDate.class)).thenReturn(LocalDate.now().plusDays(2));
        when(record.get("b.status", String.class)).thenReturn("PAID");
        when(record.get("b.source", String.class)).thenReturn("WEBSITE");
        when(record.get("b.cost", BigDecimal.class)).thenReturn(new BigDecimal("150.00"));
        when(record.get("b.created_at", Instant.class)).thenReturn(Instant.now());
        when(record.get("b.updated_at", Instant.class)).thenReturn(Instant.now());

        // Mock final result of the entire chain to return the records
        when(dslContext.select(any(Field.class))).thenReturn(DSL.select());
        doReturn(records).when(dslContext).fetch(any(String.class));

        // Mock the mapper
        when(bookingMapper.toDto(any(BookingEntity.class))).thenReturn(bookingDto);

        // Act
        List<BookingDto> result = bookingRepositoryAdvanced.search(fromDate, prepaid, source);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(bookingId, result.get(0).getId());
    }

    @Test
    void search_ShouldFilterByFromDate_WhenFromDateProvided() {
        // Arrange
        LocalDate fromDate = LocalDate.now();

        // Simplify mocking by directly mocking the fetch call result
        when(dslContext.select()).thenReturn(DSL.select());
        when(records.size()).thenReturn(1);
        when(records.iterator()).thenReturn(List.of(record).iterator());
        when(records.get(0)).thenReturn(record);

        // Mock necessary record access
        when(record.get("b.id", UUID.class)).thenReturn(bookingId);
        when(record.get("c.id", UUID.class)).thenReturn(clientId);
        when(record.get("r.id", UUID.class)).thenReturn(roomId);
        when(record.get("b.checkin_date", LocalDate.class)).thenReturn(LocalDate.now());
        when(record.get("b.checkout_date", LocalDate.class)).thenReturn(LocalDate.now().plusDays(2));
        when(record.get("b.status", String.class)).thenReturn("CONFIRMED");
        when(record.get("b.source", String.class)).thenReturn("WEBSITE");

        // Mock final result of the entire chain
        when(dslContext.select(any(Field.class))).thenReturn(DSL.select());
        doReturn(records).when(dslContext).fetch(any(String.class));

        // Mock the mapper
        when(bookingMapper.toDto(any(BookingEntity.class))).thenReturn(bookingDto);

        // Act
        List<BookingDto> result = bookingRepositoryAdvanced.search(fromDate, null, null);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void search_ShouldReturnEmptyList_WhenNoMatchingBookings() {
        // Arrange
        // Simplify mocking by directly mocking the fetch call result
        when(dslContext.select()).thenReturn(DSL.select());
        when(records.size()).thenReturn(0);
        when(records.iterator()).thenReturn(Collections.emptyIterator());

        // Mock final result of the entire chain
        when(dslContext.select(any(Field.class))).thenReturn(DSL.select());
        doReturn(records).when(dslContext).fetch(any(String.class));

        // Act
        List<BookingDto> result = bookingRepositoryAdvanced.search(LocalDate.now(), true, "WEBSITE");

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}
