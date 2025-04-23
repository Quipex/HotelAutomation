package com.hotel.backendservice.room;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
class RoomRepositoryTest {

    @Autowired
    private RoomRepository roomRepository;

    @Test
    void findByNumber_ShouldReturnRoom_WhenRoomExists() {
        // Act
        Optional<RoomEntity> result = roomRepository.findByNumber("101");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("101", result.get().getNumber());
    }

    @Test
    void findByNumber_ShouldReturnEmpty_WhenRoomDoesNotExist() {
        // Act
        Optional<RoomEntity> result = roomRepository.findByNumber("999");

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    void findByNumberContaining_ShouldReturnMatchingRooms_WhenPatternMatches() {
        // Act
        List<RoomEntity> results = roomRepository.findByNumberContaining("10");

        // Assert
        assertFalse(results.isEmpty());
        assertTrue(results.stream().allMatch(room -> room.getNumber().contains("10")));
    }

    @Test
    void findAvailableRooms_ShouldReturnAvailableRooms_WhenNoConflicts() {
        // Arrange
        LocalDate fromDate = LocalDate.now().plusDays(30); // Far in the future to avoid conflicts
        LocalDate toDate = fromDate.plusDays(2);
        int guests = 2;

        // Act
        List<RoomEntity> results = roomRepository.findAvailableRooms(fromDate, toDate, guests);

        // Assert
        assertFalse(results.isEmpty());
        assertTrue(results.stream().allMatch(room -> room.getCapacity() >= guests));
    }

    @Test
    void findAvailableRooms_ShouldFilterByCapacity_WhenGuestsProvided() {
        // Arrange
        LocalDate fromDate = LocalDate.now().plusDays(30);
        LocalDate toDate = fromDate.plusDays(2);
        int guests = 4; // Only large rooms should match

        // Act
        List<RoomEntity> results = roomRepository.findAvailableRooms(fromDate, toDate, guests);

        // Assert
        assertFalse(results.isEmpty());
        assertTrue(results.stream().allMatch(room -> room.getCapacity() >= guests));
    }

    @Test
    void save_ShouldPersistRoom_WhenValidRoomProvided() {
        // Arrange
        UUID id = UUID.randomUUID();
        RoomEntity room = new RoomEntity();
        room.setId(id);
        room.setNumber("501");
        room.setFloor(5);
        room.setHasSeaView(true);
        room.setBalconySide("North");
        room.setType("Suite");
        room.setMaxAdults(3);
        room.setCapacity(4);
        room.setNotes("Test suite");

        // Act
        RoomEntity savedRoom = roomRepository.save(room);
        
        // Assert
        assertEquals(id, savedRoom.getId());
        
        // Verify it's retrievable
        Optional<RoomEntity> retrievedRoom = roomRepository.findById(id);
        assertTrue(retrievedRoom.isPresent());
        assertEquals("501", retrievedRoom.get().getNumber());
    }
} 