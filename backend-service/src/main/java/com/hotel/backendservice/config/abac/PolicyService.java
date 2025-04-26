package com.hotel.backendservice.config.abac;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.hotel.backendservice.notification.NotificationService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for loading and validating ABAC policies from a YAML file
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class PolicyService {

    private final NotificationService notificationService;
    private final ExpressionParser expressionParser = new SpelExpressionParser();
    
    @Value("${abac.policies.file:classpath:abac-policies.yml}")
    private String policiesFile;
    
    // Store compiled policies for quick access
    private final Map<String, Expression> compiledPolicies = new ConcurrentHashMap<>();
    
    @PostConstruct
    public void init() {
        try {
            reloadPolicies();
        } catch (Exception e) {
            log.error("Failed to load ABAC policies on startup", e);
            notificationService.notify("admin", "Failed to load ABAC policies on startup: " + e.getMessage());
        }
    }
    
    /**
     * Reload policies from the YAML file
     * @return true if policies were successfully reloaded, false otherwise
     */
    public boolean reloadPolicies() {
        try {
            PolicyConfig policyConfig = loadPolicyConfig();
            
            // Clear existing policies
            compiledPolicies.clear();
            
            // Compile and store each policy
            for (Map.Entry<String, String> entry : policyConfig.getPolicies().entrySet()) {
                String policyName = entry.getKey();
                String policyExpression = entry.getValue();
                
                try {
                    // Validate that the expression can be parsed
                    Expression compiled = expressionParser.parseExpression(policyExpression);
                    compiledPolicies.put(policyName, compiled);
                    log.info("Loaded policy: {} -> {}", policyName, policyExpression);
                } catch (Exception e) {
                    log.error("Failed to parse policy expression: {} -> {}", policyName, policyExpression, e);
                    notificationService.notify("admin", 
                            "Failed to parse policy expression: " + policyName + " -> " + policyExpression +
                                    ". Error: " + e.getMessage());
                    return false;
                }
            }
            
            log.info("Successfully loaded {} ABAC policies", compiledPolicies.size());
            return true;
        } catch (Exception e) {
            log.error("Failed to reload ABAC policies", e);
            notificationService.notify("admin", "Failed to reload ABAC policies: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Get a compiled policy by name
     * @param policyName The name of the policy
     * @return The compiled policy expression, or null if not found
     */
    public Expression getPolicy(String policyName) {
        return compiledPolicies.get(policyName);
    }
    
    /**
     * Get all policy names
     * @return A set of all policy names
     */
    public Map<String, Expression> getAllPolicies() {
        return Collections.unmodifiableMap(compiledPolicies);
    }
    
    /**
     * Load policy configuration from YAML file
     * @return The policy configuration
     * @throws IOException If the file cannot be read or parsed
     */
    protected PolicyConfig loadPolicyConfig() throws IOException {
        ObjectMapper yamlMapper = new ObjectMapper(new YAMLFactory());
        File file = new File(policiesFile.replace("classpath:", ""));
        
        if (!file.exists()) {
            log.warn("Policy file not found: {}, using default (empty) policies", policiesFile);
            return new PolicyConfig(new HashMap<>());
        }
        
        log.debug("Loading policies from file: {}", file.getAbsolutePath());
        return yamlMapper.readValue(file, PolicyConfig.class);
    }
} 