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

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final ClientRepository clientRepository;
    private final RoomRepository roomRepository;

    /**
     * Create a new booking
     *
     * @param dto The booking data
     * @return The created booking DTO
     */
    @Transactional
    public BookingDto create(BookingDto dto) {
        // Validate client and room exist
        clientRepository.findById(dto.getClientId())
            .orElseThrow(() -> new RuntimeException("Client not found with ID: " + dto.getClientId()));

        roomRepository.findById(dto.getRoomId())
            .orElseThrow(() -> new RuntimeException("Room not found with ID: " + dto.getRoomId()));

        if (dto.getId() == null) {
            dto.setId(UUID.randomUUID());
        }

        BookingEntity entity = bookingMapper.toEntity(dto);
        BookingEntity savedEntity = bookingRepository.save(entity);
        return bookingMapper.toDto(savedEntity);
    }

    /**
     * Update an existing booking
     *
     * @param id  The booking ID
     * @param dto The updated booking data
     * @return The updated booking DTO
     */
    @Transactional
    public BookingDto update(UUID id, BookingDto dto) {
        BookingEntity entity = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        // Set client ID in the audit context for ABAC evaluation
        AuditContextHolder.setAttribute("bookingUserId", entity.getClient().getId());

        // Validate client and room exist if they are being changed
        if (dto.getClientId() != null && !dto.getClientId().equals(entity.getClient().getId())) {
            clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + dto.getClientId()));
        }

        if (dto.getRoomId() != null && !dto.getRoomId().equals(entity.getRoom().getId())) {
            roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found with ID: " + dto.getRoomId()));
        }

        dto.setId(id);
        bookingMapper.updateEntity(dto, entity);

        BookingEntity savedEntity = bookingRepository.save(entity);
        return bookingMapper.toDto(savedEntity);
    }

    /**
     * Cancel a booking
     *
     * @param id The booking ID
     */
    @Transactional
    public void cancel(UUID id) {
        BookingEntity entity = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        // Set client ID in the audit context for ABAC evaluation
        AuditContextHolder.setAttribute("bookingUserId", entity.getClient().getId());

        entity.setStatus("CANCELLED");
        bookingRepository.save(entity);
    }

    /**
     * Find a booking by ID
     *
     * @param id The booking ID
     * @return The booking DTO
     */
    @Transactional(readOnly = true)
    public BookingDto findById(UUID id) {
        BookingEntity entity = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        // Set client ID in the audit context for ABAC evaluation
        AuditContextHolder.setAttribute("bookingUserId", entity.getClient().getId());

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
        // For search operation we don't set specific booking user context
        // The ABAC policy will need to check the user's role
        return bookingRepository.search(from, prepaid, source);
    }
}
