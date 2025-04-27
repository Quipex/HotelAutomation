package com.hotel.backendservice.audit;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for audit log operations
 */
@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@Tag(name = "Audit", description = "Audit log operations")
public class AuditController {

    private final AuditService auditService;

    /**
     * Get audit logs for a specific object
     *
     * @param objectType The type of object (e.g., "booking", "client", "room")
     * @param objectId   The ID of the object
     * @return List of audit logs for the object
     */
    @GetMapping
    @Operation(summary = "Get audit logs for an object",
        description = "Get audit logs for a specific object type and ID")
    public ResponseEntity<List<AuditLogEntity>> getAuditLogs(
        @Parameter(description = "Object type (e.g., booking, client, room)", required = true)
        @RequestParam String objectType,

        @Parameter(description = "Object ID", required = true)
        @RequestParam String objectId
    ) {
        List<AuditLogEntity> auditLogs = auditService.findAuditLogsForObject(objectType, objectId);
        return ResponseEntity.ok(auditLogs);
    }
}
