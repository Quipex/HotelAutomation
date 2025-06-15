package com.hotel.backendservice.client;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@Tag(name = "Client Controller", description = "API for managing clients")
public class ClientController {

    private final ClientService clientService;

    @GetMapping("/{id}")
    @Operation(summary = "Find client by ID", description = "Returns a client based on ID")
    public ResponseEntity<ClientDto> findById(
        @Parameter(description = "Client ID", required = true)
        @PathVariable UUID id) {
        return ResponseEntity.ok(clientService.findById(id));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update client", description = "Updates an existing client and returns the updated entity")
    public ResponseEntity<ClientDto> update(
        @Parameter(description = "Client ID", required = true)
        @PathVariable UUID id,
        @Parameter(description = "Updated client data", required = true)
        @Valid @RequestBody ClientDto clientDto) {
        return ResponseEntity.ok(clientService.update(id, clientDto));
    }

    @GetMapping
    @Operation(summary = "Search clients", description = "Search clients by name (fuzzy search)")
    public ResponseEntity<List<ClientDto>> searchByName(
        @Parameter(description = "Name to search for (fuzzy search)")
        @RequestParam(required = false) String name) {
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(clientService.searchByName(name));
    }
}
