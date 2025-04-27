package com.hotel.backendservice.room;

import com.hotel.backendservice.config.abac.CheckPermission;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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
    @CheckPermission("view_room")
    public ResponseEntity<RoomDto> findById(
        @Parameter(description = "Room ID", required = true)
        @PathVariable UUID id) {
        return ResponseEntity.ok(roomService.findById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Search rooms", description = "Search rooms by number")
    @CheckPermission("view_rooms")
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
    @CheckPermission("view_available_rooms")
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
