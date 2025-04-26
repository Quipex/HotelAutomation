package com.hotel.backendservice.config.abac;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

/**
 * Configuration class for ABAC policies loaded from YAML
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PolicyConfig {
    /**
     * Map of policy names to SpEL expressions
     */
    private Map<String, String> policies = new HashMap<>();
} 