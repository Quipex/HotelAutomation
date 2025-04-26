package com.hotel.backendservice.room;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Tag(name = "Room Controller", description = "API for managing rooms")
@Validated
public class RoomController {

  private final RoomService roomService;

  @GetMapping("/{id}")
  @Operation(summary = "Find room by ID", description = "Returns a room based on ID")
  public ResponseEntity<RoomDto> findById(
    @Parameter(description = "Room ID", required = true)
    @PathVariable UUID id) {
    return ResponseEntity.ok(roomService.findById(id));
  }

  @PostMapping
  @Operation(summary = "Create a new room", description = "Creates a new room and returns the created entity")
  public ResponseEntity<RoomDto> create(
    @Parameter(description = "Room data", required = true)
    @Valid @RequestBody RoomDto roomDto) {
    return ResponseEntity.ok(roomService.create(roomDto));
  }

  @PatchMapping("/{id}")
  @Operation(summary = "Update room", description = "Updates an existing room and returns the updated entity")
  public ResponseEntity<RoomDto> update(
    @Parameter(description = "Room ID", required = true)
    @PathVariable UUID id,
    @Parameter(description = "Updated room data", required = true)
    @Valid @RequestBody RoomDto roomDto) {
    return ResponseEntity.ok(roomService.update(id, roomDto));
  }

  @GetMapping
  @Operation(summary = "Search rooms", description = "Search rooms by number")
  public ResponseEntity<List<RoomDto>> searchByNumber(
    @Parameter(description = "Room number pattern to search for")
    @RequestParam(required = false) String number) {
    if (number == null || number.isBlank()) {
      return ResponseEntity.badRequest().build();
    }
    return ResponseEntity.ok(roomService.searchByNumber(number));
  }

  @GetMapping("/available")
  @Operation(summary = "Find available rooms", description = "Find rooms available for a given date range and guest count")
  public ResponseEntity<List<RoomDto>> findAvailableRooms(
    @Parameter(description = "Check-in date", required = true)
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
    @Parameter(description = "Number of days of stay", required = true)
    @RequestParam @Min(1) @Max(365) int numDays,
    @Parameter(description = "Number of guests", required = true)
    @RequestParam @Min(1) @Max(10) int guests) {
    return ResponseEntity.ok(roomService.findAvailableRooms(fromDate, numDays, guests));
  }
}
