package com.hotel.backendservice.security.abac;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for policy management endpoints
 */
@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
@Tag(name = "Policies", description = "ABAC policy management")
public class PolicyController {

    private final PolicyService policyService;

    /**
     * Reload ABAC policies from the configured file
     *
     * @return Response with success status and message
     */
    @PostMapping("/reload")
    @Operation(summary = "Reload ABAC policies",
        description = "Reload ABAC policies from the configured file")
    @CheckPermission("admin")
    public ResponseEntity<Map<String, Object>> reloadPolicies() {
        boolean success = policyService.reloadPolicies();

        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", success ?
            "ABAC policies reloaded successfully" :
            "Failed to reload ABAC policies, check server logs");

        if (success) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
