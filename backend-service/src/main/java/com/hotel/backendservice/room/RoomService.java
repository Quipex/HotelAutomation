package com.hotel.backendservice.room;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;

    /**
     * Create a new room
     *
     * @param dto The room data
     * @return The created room DTO
     */
    @Transactional
    public RoomDto create(RoomDto dto) {
        // Check if a room with the same number already exists
        roomRepository.findByNumber(dto.getNumber()).ifPresent(existingRoom -> {
            throw new RuntimeException("Room with number " + dto.getNumber() + " already exists");
        });

        if (dto.getId() == null) {
            dto.setId(UUID.randomUUID());
        }

        RoomEntity entity = roomMapper.toEntity(dto);
        RoomEntity savedEntity = roomRepository.save(entity);
        return roomMapper.toDto(savedEntity);
    }

    /**
     * Update an existing room
     *
     * @param id  The room ID
     * @param dto The updated room data
     * @return The updated room DTO
     */
    @Transactional
    public RoomDto update(UUID id, RoomDto dto) {
        RoomEntity entity = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with ID: " + id));

        // Check if number is changed and that it doesn't conflict with existing rooms
        if (dto.getNumber() != null && !dto.getNumber().equals(entity.getNumber())) {
            roomRepository.findByNumber(dto.getNumber()).ifPresent(existingRoom -> {
                throw new RuntimeException("Room with number " + dto.getNumber() + " already exists");
            });
        }

        dto.setId(id);
        roomMapper.updateEntity(dto, entity);

        RoomEntity savedEntity = roomRepository.save(entity);
        return roomMapper.toDto(savedEntity);
    }

    /**
     * Find a room by ID
     *
     * @param id The room ID
     * @return The room DTO
     */
    @Transactional(readOnly = true)
    public RoomDto findById(UUID id) {
        RoomEntity entity = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with ID: " + id));

        return roomMapper.toDto(entity);
    }

    /**
     * Search rooms by number
     *
     * @param number The room number pattern to search for
     * @return List of matching room DTOs
     */
    @Transactional(readOnly = true)
    public List<RoomDto> searchByNumber(String number) {
        List<RoomEntity> entities = roomRepository.findByNumberContaining(number);
        return entities.stream()
                .map(roomMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Find available rooms for a given date range and guest count
     *
     * @param fromDate The check-in date
     * @param numDays  The number of days of stay
     * @param guests   The number of guests
     * @return List of available room DTOs
     */
    @Transactional(readOnly = true)
    public List<RoomDto> findAvailableRooms(LocalDate fromDate, int numDays, int guests) {
        LocalDate toDate = fromDate.plusDays(numDays);
        List<RoomEntity> entities = roomRepository.findAvailableRooms(fromDate, toDate, guests);
        return entities.stream()
                .map(roomMapper::toDto)
                .collect(Collectors.toList());
    }
}
