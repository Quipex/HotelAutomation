package com.hotel.backendservice.booking;

import com.hotel.backendservice.client.ClientRepository;
import com.hotel.backendservice.room.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BookingMapper bookingMapper;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private BookingService bookingService;

    private UUID bookingId;
    private UUID clientId;
    private UUID roomId;
    private BookingDto bookingDto;
    private BookingEntity bookingEntity;

    @BeforeEach
    void setUp() {
        bookingId = UUID.randomUUID();
        clientId = UUID.randomUUID();
        roomId = UUID.randomUUID();

        // Setup BookingDto
        bookingDto = new BookingDto();
        bookingDto.setId(bookingId);
        bookingDto.setClientId(clientId);
        bookingDto.setRoomId(roomId);
        bookingDto.setCheckinDate(LocalDate.now().plusDays(1));
        bookingDto.setCheckoutDate(LocalDate.now().plusDays(3));
        bookingDto.setStatus("PENDING_PAYMENT");
        bookingDto.setSource("WEBSITE");
        bookingDto.setCost(new BigDecimal("150.00"));
        bookingDto.setNotes("Test booking");

        // Setup BookingEntity
        bookingEntity = new BookingEntity();
        bookingEntity.setId(bookingId);
        // Other entity properties would be set here in a real scenario
    }

    @Test
    void create_ShouldCreateBooking_WhenValidDataProvided() {
        // Arrange
        when(clientRepository.findById(clientId)).thenReturn(Optional.of(mock(com.hotel.backendservice.client.ClientEntity.class)));
        when(roomRepository.findById(roomId)).thenReturn(Optional.of(mock(com.hotel.backendservice.room.RoomEntity.class)));
        when(bookingMapper.toEntity(bookingDto)).thenReturn(bookingEntity);
        when(bookingRepository.save(bookingEntity)).thenReturn(bookingEntity);
        when(bookingMapper.toDto(bookingEntity)).thenReturn(bookingDto);

        // Act
        BookingDto result = bookingService.create(bookingDto);

        // Assert
        assertNotNull(result);
        assertEquals(bookingId, result.getId());
        verify(bookingRepository).save(bookingEntity);
    }

    @Test
    void create_ShouldThrowException_WhenClientNotFound() {
        // Arrange
        when(clientRepository.findById(clientId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> bookingService.create(bookingDto));
        verify(bookingRepository, never()).save(any());
    }

    @Test
    void update_ShouldUpdateBooking_WhenValidDataProvided() {
        // Arrange
        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(bookingEntity));
        when(bookingRepository.save(bookingEntity)).thenReturn(bookingEntity);
        when(bookingMapper.toDto(bookingEntity)).thenReturn(bookingDto);

        // Act
        BookingDto result = bookingService.update(bookingId, bookingDto);

        // Assert
        assertNotNull(result);
        assertEquals(bookingId, result.getId());
        verify(bookingMapper).updateEntity(bookingDto, bookingEntity);
        verify(bookingRepository).save(bookingEntity);
    }

    @Test
    void cancel_ShouldCancelBooking_WhenBookingExists() {
        // Arrange
        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(bookingEntity));

        // Act
        bookingService.cancel(bookingId);

        // Assert
        verify(bookingEntity).setStatus("CANCELLED");
        verify(bookingRepository).save(bookingEntity);
    }

    @Test
    void findById_ShouldReturnBooking_WhenBookingExists() {
        // Arrange
        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(bookingEntity));
        when(bookingMapper.toDto(bookingEntity)).thenReturn(bookingDto);

        // Act
        BookingDto result = bookingService.findById(bookingId);

        // Assert
        assertNotNull(result);
        assertEquals(bookingId, result.getId());
    }

    @Test
    void search_ShouldReturnBookings_WhenFiltersApplied() {
        // Arrange
        LocalDate fromDate = LocalDate.now();
        Boolean prepaid = true;
        String source = "WEBSITE";
        List<BookingDto> expectedBookings = Arrays.asList(bookingDto);
        
        when(bookingRepository.search(fromDate, prepaid, source)).thenReturn(expectedBookings);

        // Act
        List<BookingDto> result = bookingService.search(fromDate, prepaid, source);

        // Assert
        assertNotNull(result);
        assertEquals(expectedBookings.size(), result.size());
        assertEquals(expectedBookings.get(0), result.get(0));
    }
} 