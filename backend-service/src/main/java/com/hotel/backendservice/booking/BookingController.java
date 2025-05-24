package com.hotel.backendservice.booking;

import com.hotel.backendservice.audit.AuditContextHolder;
import com.hotel.backendservice.audit.AuditableAction;
import com.hotel.backendservice.security.abac.CheckPermission;
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
    @CheckPermission("view_booking")
    @AuditableAction(action = "view", objectType = "booking", objectIdExpression = "#id")
    public ResponseEntity<BookingDto> findById(
        @Parameter(description = "Booking ID", required = true)
        @PathVariable UUID id
    ) {
        // Set bookingId in audit context for ABAC evaluation
        AuditContextHolder.setAttribute("bookingId", id);
        try {
            return ResponseEntity.ok(bookingService.findById(id));
        } finally {
            AuditContextHolder.clearContext();
        }
    }

    @PostMapping
    @Operation(summary = "Create a new booking", description = "Creates a new booking and returns the created entity")
    @CheckPermission("create_booking")
    @AuditableAction(action = "create", objectType = "booking", objectIdExpression = "returnObject.body.id")
    public ResponseEntity<BookingDto> create(
        @Parameter(description = "Booking data", required = true)
        @Valid @RequestBody BookingDto bookingDto
    ) {
        // Set clientId in audit context for ABAC evaluation
        AuditContextHolder.setAttribute("clientId", bookingDto.getClientId());
        try {
            return ResponseEntity.ok(bookingService.create(bookingDto));
        } finally {
            AuditContextHolder.clearContext();
        }
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update booking", description = "Updates an existing booking and returns the updated entity")
    @CheckPermission("modify_booking")
    @AuditableAction(action = "update", objectType = "booking", objectIdExpression = "#id")
    public ResponseEntity<BookingDto> update(
        @Parameter(description = "Booking ID", required = true)
        @PathVariable UUID id,
        @Parameter(description = "Updated booking data", required = true)
        @Valid @RequestBody BookingDto bookingDto
    ) {
        // Set bookingId in audit context for ABAC evaluation
        AuditContextHolder.setAttribute("bookingId", id);
        try {
            return ResponseEntity.ok(bookingService.update(id, bookingDto));
        } finally {
            AuditContextHolder.clearContext();
        }
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel booking", description = "Cancels a booking")
    @CheckPermission("modify_booking")
    @AuditableAction(action = "cancel", objectType = "booking", objectIdExpression = "#id")
    public ResponseEntity<Void> cancel(
        @Parameter(description = "Booking ID", required = true)
        @PathVariable UUID id
    ) {
        // Set bookingId in audit context for ABAC evaluation
        AuditContextHolder.setAttribute("bookingId", id);
        try {
            bookingService.cancel(id);
            return ResponseEntity.ok().build();
        } finally {
            AuditContextHolder.clearContext();
        }
    }

    @GetMapping
    @Operation(summary = "Search bookings", description = "Search bookings with various filters")
    @CheckPermission("view_bookings")
    @AuditableAction(action = "search", objectType = "bookings", detailsExpression = "{'from': #from, 'prepaid': #prepaid, 'source': #source}")
    public ResponseEntity<List<BookingDto>> search(
        @Parameter(description = "Filter by check-in date from")
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @Parameter(description = "Filter by payment status (true = paid, false = pending)")
        @RequestParam(required = false) Boolean prepaid,
        @Parameter(description = "Filter by booking source")
        @RequestParam(required = false) String source
    ) {
        return ResponseEntity.ok(bookingService.search(from, prepaid, source));
    }
}
