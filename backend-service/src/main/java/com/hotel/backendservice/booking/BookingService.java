package com.hotel.backendservice.booking;

import com.hotel.backendservice.audit.AuditContextHolder;
import com.hotel.backendservice.client.ClientRepository;
import com.hotel.backendservice.room.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ClientRepository clientRepository;
    private final RoomRepository roomRepository;
    private final BookingMapper bookingMapper;

    public BookingDto findById(UUID id) {
        BookingEntity entity = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        return bookingMapper.toDto(entity);
    }

    public List<BookingDto> findAll() {
        return bookingRepository.findAll().stream()
            .map(bookingMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<BookingDto> findByClientId(UUID clientId) {
        return bookingRepository.findByClientId(clientId).stream()
            .map(bookingMapper::toDto)
            .collect(Collectors.toList());
    }

    public BookingDto create(BookingCreateDto dto) {
        // Validate client and room exist
        ClientEntity client = clientRepository.findById(dto.getClientId())
            .orElseThrow(() -> new RuntimeException("Client not found with ID: " + dto.getClientId()));

        RoomEntity room = roomRepository.findById(dto.getRoomId())
            .orElseThrow(() -> new RuntimeException("Room not found with ID: " + dto.getRoomId()));

        // Create booking entity
        BookingEntity entity = new BookingEntity();
        entity.setClient(client);
        entity.setRoom(room);
        entity.setFromDate(dto.getFromDate());
        entity.setNumDays(dto.getNumDays());
        entity.setNumGuests(dto.getNumGuests());
        entity.setStatus("PENDING");
        entity.setNotes(dto.getNotes());

        // Save and return
        entity = bookingRepository.save(entity);
        return bookingMapper.toDto(entity);
    }

    public BookingDto update(UUID id, BookingUpdateDto dto) {
        BookingEntity entity = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        // Validate client and room exist if they are being changed
        if (dto.getClientId() != null && !dto.getClientId().equals(entity.getClient().getId())) {
            ClientEntity client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + dto.getClientId()));
            entity.setClient(client);
        }

        if (dto.getRoomId() != null && !dto.getRoomId().equals(entity.getRoom().getId())) {
            RoomEntity room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found with ID: " + dto.getRoomId()));
            entity.setRoom(room);
        }

        // Update other fields if provided
        if (dto.getFromDate() != null) {
            entity.setFromDate(dto.getFromDate());
        }
        if (dto.getNumDays() != null) {
            entity.setNumDays(dto.getNumDays());
        }
        if (dto.getNumGuests() != null) {
            entity.setNumGuests(dto.getNumGuests());
        }
        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }
        if (dto.getNotes() != null) {
            entity.setNotes(dto.getNotes());
        }

        // Save and return
        entity = bookingRepository.save(entity);
        return bookingMapper.toDto(entity);
    }

    public void cancel(UUID id) {
        BookingEntity entity = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        entity.setStatus("CANCELLED");
        bookingRepository.save(entity);
    }

    public BookingDto getBookingDetails(UUID id) {
        BookingEntity entity = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        return bookingMapper.toDto(entity);
    }

    /**
     * Search bookings with various filters
     *
     * @param from    The date to filter from (check-in date)
     * @param prepaid Whether the booking is prepaid or not
     * @param source  The booking source
     * @return List of matching booking DTOs
     */
    @Transactional(readOnly = true)
    public List<BookingDto> search(LocalDate from, Boolean prepaid, String source) {
        return bookingRepository.search(from, prepaid, source);
    }
}
