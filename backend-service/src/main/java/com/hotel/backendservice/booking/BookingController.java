package com.hotel.backendservice.booking;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Booking Controller", description = "API for managing bookings")
public class BookingController {

    private final BookingService bookingService;

    @GetMapping("/{id}")
    @Operation(summary = "Find booking by ID", description = "Returns a booking based on ID")
    public ResponseEntity<BookingDto> findById(
            @Parameter(description = "Booking ID", required = true)
            @PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new booking", description = "Creates a new booking and returns the created entity")
    public ResponseEntity<BookingDto> create(
            @Parameter(description = "Booking data", required = true)
            @Valid @RequestBody BookingDto bookingDto) {
        return ResponseEntity.ok(bookingService.create(bookingDto));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update booking", description = "Updates an existing booking and returns the updated entity")
    public ResponseEntity<BookingDto> update(
            @Parameter(description = "Booking ID", required = true)
            @PathVariable UUID id,
            @Parameter(description = "Updated booking data", required = true)
            @Valid @RequestBody BookingDto bookingDto) {
        return ResponseEntity.ok(bookingService.update(id, bookingDto));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel booking", description = "Cancels a booking")
    public ResponseEntity<Void> cancel(
            @Parameter(description = "Booking ID", required = true)
            @PathVariable UUID id) {
        bookingService.cancel(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @Operation(summary = "Search bookings", description = "Search bookings with various filters")
    public ResponseEntity<List<BookingDto>> search(
            @Parameter(description = "Filter by check-in date from")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @Parameter(description = "Filter by payment status (true = paid, false = pending)")
            @RequestParam(required = false) Boolean prepaid,
            @Parameter(description = "Filter by booking source")
            @RequestParam(required = false) String source) {
        return ResponseEntity.ok(bookingService.search(from, prepaid, source));
    }
}
