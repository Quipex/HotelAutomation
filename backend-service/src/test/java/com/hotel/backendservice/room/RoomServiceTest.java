package com.hotel.backendservice.room;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

  @Mock
  private RoomRepository roomRepository;

  @Mock
  private RoomMapper roomMapper;

  @InjectMocks
  private RoomService roomService;

  private UUID roomId;
  private RoomDto roomDto;
  private RoomEntity roomEntity;

  @BeforeEach
  void setUp() {
    roomId = UUID.randomUUID();

    // Setup RoomDto
    roomDto = new RoomDto();
    roomDto.setId(roomId);
    roomDto.setNumber("101");
    roomDto.setFloor(1);
    roomDto.setHasSeaView(true);
    roomDto.setBalconySide("East");
    roomDto.setType("Standard");
    roomDto.setMaxAdults(2);
    roomDto.setCapacity(3);
    roomDto.setNotes("Test room");

    // Setup RoomEntity
    roomEntity = new RoomEntity();
    roomEntity.setId(roomId);
    roomEntity.setNumber("101");
    // Other entity properties would be set here in a real scenario
  }

  @Test
  void create_ShouldCreateRoom_WhenValidDataProvided() {
    // Arrange
    when(roomRepository.findByNumber(roomDto.getNumber())).thenReturn(Optional.empty());
    when(roomMapper.toEntity(roomDto)).thenReturn(roomEntity);
    when(roomRepository.save(roomEntity)).thenReturn(roomEntity);
    when(roomMapper.toDto(roomEntity)).thenReturn(roomDto);

    // Act
    RoomDto result = roomService.create(roomDto);

    // Assert
    assertNotNull(result);
    assertEquals(roomId, result.getId());
    verify(roomRepository).save(roomEntity);
  }

  @Test
  void create_ShouldThrowException_WhenRoomNumberAlreadyExists() {
    // Arrange
    when(roomRepository.findByNumber(roomDto.getNumber())).thenReturn(Optional.of(new RoomEntity()));

    // Act & Assert
    assertThrows(RuntimeException.class, () -> roomService.create(roomDto));
    verify(roomRepository, never()).save(any());
  }

  @Test
  void create_ShouldGenerateId_WhenIdIsNull() {
    // Arrange
    roomDto.setId(null);
    when(roomRepository.findByNumber(roomDto.getNumber())).thenReturn(Optional.empty());
    when(roomMapper.toEntity(roomDto)).thenReturn(roomEntity);
    when(roomRepository.save(roomEntity)).thenReturn(roomEntity);
    when(roomMapper.toDto(roomEntity)).thenReturn(roomDto);

    // Act
    RoomDto result = roomService.create(roomDto);

    // Assert
    assertNotNull(result);
    verify(roomRepository).save(roomEntity);
  }

  @Test
  void update_ShouldUpdateRoom_WhenValidDataProvided() {
    // Arrange
    when(roomRepository.findById(roomId)).thenReturn(Optional.of(roomEntity));
    when(roomRepository.save(roomEntity)).thenReturn(roomEntity);
    when(roomMapper.toDto(roomEntity)).thenReturn(roomDto);

    // Act
    RoomDto result = roomService.update(roomId, roomDto);

    // Assert
    assertNotNull(result);
    assertEquals(roomId, result.getId());
    verify(roomMapper).updateEntity(roomDto, roomEntity);
    verify(roomRepository).save(roomEntity);
  }

  @Test
  void update_ShouldThrowException_WhenRoomNotFound() {
    // Arrange
    when(roomRepository.findById(roomId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> roomService.update(roomId, roomDto));
    verify(roomRepository, never()).save(any());
  }

  @Test
  void update_ShouldThrowException_WhenNumberChangedAndAlreadyExists() {
    // Arrange
    RoomDto updatedDto = new RoomDto();
    updatedDto.setId(roomId);
    updatedDto.setNumber("102"); // Different from original

    RoomEntity existingEntity = new RoomEntity();
    existingEntity.setId(roomId);
    existingEntity.setNumber("101"); // Original number

    when(roomRepository.findById(roomId)).thenReturn(Optional.of(existingEntity));
    when(roomRepository.findByNumber("102")).thenReturn(Optional.of(new RoomEntity())); // Another room with 102 already exists

    // Act & Assert
    assertThrows(RuntimeException.class, () -> roomService.update(roomId, updatedDto));
    verify(roomRepository, never()).save(any());
  }

  @Test
  void findById_ShouldReturnRoom_WhenRoomExists() {
    // Arrange
    when(roomRepository.findById(roomId)).thenReturn(Optional.of(roomEntity));
    when(roomMapper.toDto(roomEntity)).thenReturn(roomDto);

    // Act
    RoomDto result = roomService.findById(roomId);

    // Assert
    assertNotNull(result);
    assertEquals(roomId, result.getId());
  }

  @Test
  void findById_ShouldThrowException_WhenRoomNotFound() {
    // Arrange
    when(roomRepository.findById(roomId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> roomService.findById(roomId));
  }

  @Test
  void searchByNumber_ShouldReturnRooms_WhenNumberMatches() {
    // Arrange
    String number = "10";
    List<RoomEntity> roomEntities = Arrays.asList(roomEntity);

    when(roomRepository.findByNumberContaining(number)).thenReturn(roomEntities);
    when(roomMapper.toDto(roomEntity)).thenReturn(roomDto);

    // Act
    List<RoomDto> results = roomService.searchByNumber(number);

    // Assert
    assertNotNull(results);
    assertFalse(results.isEmpty());
    assertEquals(1, results.size());
    assertEquals(roomId, results.get(0).getId());
  }

  @Test
  void findAvailableRooms_ShouldReturnRooms_WhenRoomsAvailable() {
    // Arrange
    LocalDate fromDate = LocalDate.now();
    int numDays = 3;
    int guests = 2;
    LocalDate toDate = fromDate.plusDays(numDays);
    List<RoomEntity> roomEntities = Arrays.asList(roomEntity);

    when(roomRepository.findAvailableRooms(fromDate, toDate, guests)).thenReturn(roomEntities);
    when(roomMapper.toDto(roomEntity)).thenReturn(roomDto);

    // Act
    List<RoomDto> results = roomService.findAvailableRooms(fromDate, numDays, guests);

    // Assert
    assertNotNull(results);
    assertFalse(results.isEmpty());
    assertEquals(1, results.size());
    assertEquals(roomId, results.get(0).getId());
  }

  @Test
  void findAvailableDelegatesToRepo() {
    // Arrange
    LocalDate from = LocalDate.of(2025, 5, 1);
    int days = 3, guests = 2;
    List<RoomAvailabilityDto> expected = List.of();
    when(roomRepository.findAvailableRoomsProjection(from, from.plusDays(days - 1), guests)).thenReturn(expected);

    // Act
    List<RoomAvailabilityDto> result = roomService.findAvailable(from, days, guests);

    // Assert
    assertSame(expected, result);
    verify(roomRepository).findAvailableRoomsProjection(from, from.plusDays(days - 1), guests);
  }
}
