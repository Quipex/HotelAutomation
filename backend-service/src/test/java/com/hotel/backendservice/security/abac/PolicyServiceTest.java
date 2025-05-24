package com.hotel.backendservice.security.abac;

import com.hotel.backendservice.notification.NotificationService;
import com.hotel.backendservice.security.abac.PolicyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.expression.Expression;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PolicyServiceTest {

    @Mock
    private NotificationService notificationService;

    @Spy
    @InjectMocks
    private PolicyService policyService;

    private Path tempPolicyFile;

    @BeforeEach
    void setUp() throws IOException {
        // Create a temporary policy file for testing
        tempPolicyFile = Files.createTempFile("test-policies", ".yml");
        ReflectionTestUtils.setField(policyService, "policiesFile", tempPolicyFile.toString());
    }

    @Test
    void reloadPolicies_shouldLoadValidPolicies() throws IOException {
        // Write valid policies to the temporary file
        String yamlContent = """
            policies:
              admin: "role == 'admin'"
              manager: "role == 'admin' or role == 'manager'"
              user: "true"
            """;

        try (FileWriter writer = new FileWriter(tempPolicyFile.toFile())) {
            writer.write(yamlContent);
        }

        // Reload policies
        boolean result = policyService.reloadPolicies();

        // Verify
        assertTrue(result);

        // Check that policies were loaded
        Expression adminPolicy = policyService.getPolicy("admin");
        assertNotNull(adminPolicy);

        Expression managerPolicy = policyService.getPolicy("manager");
        assertNotNull(managerPolicy);

        Expression userPolicy = policyService.getPolicy("user");
        assertNotNull(userPolicy);

        // Verify no notifications were sent
        verify(notificationService, never()).notify(anyString(), anyString());
    }

    @Test
    void reloadPolicies_shouldFailWithInvalidPolicies() throws IOException {
        // Write invalid policies to the temporary file
        String yamlContent = "policies:\n" +
            "  admin: \"role == 'admin'\"\n" +
            "  invalid: \"role === 'manager'\"\n"; // Invalid SpEL syntax

        try (FileWriter writer = new FileWriter(tempPolicyFile.toFile())) {
            writer.write(yamlContent);
        }

        // Reload policies
        boolean result = policyService.reloadPolicies();

        // Verify
        assertFalse(result);

        // Admin policy should be loaded, but invalid one should not
        Expression adminPolicy = policyService.getPolicy("admin");
        assertNotNull(adminPolicy);

        Expression invalidPolicy = policyService.getPolicy("invalid");
        assertNull(invalidPolicy);

        // Verify notification was sent
        verify(notificationService).notify(eq("admin"), contains("Failed to parse policy expression"));
    }

    @Test
    void reloadPolicies_shouldHandleMissingFile() {
        // Set non-existent file
        ReflectionTestUtils.setField(policyService, "policiesFile", "non-existent-file.yml");

        // Reload policies
        boolean result = policyService.reloadPolicies();

        // Should be true but log a warning (no exception)
        assertTrue(result);

        // Verify no notifications were sent
        verify(notificationService, never()).notify(anyString(), anyString());
    }

    @Test
    void reloadPolicies_shouldHandleInvalidYaml() throws IOException {
        // Write invalid YAML to the temporary file
        String yamlContent = "policies:\n" +
            "  admin: \"role == 'admin\"\n" + // Missing closing quote
            "  manager: role == 'manager'\n"; // No quotes at all

        try (FileWriter writer = new FileWriter(tempPolicyFile.toFile())) {
            writer.write(yamlContent);
        }

        // Mock the YAML parser to throw an exception
        doThrow(new IOException("Invalid YAML"))
            .when(policyService).loadPolicyConfig();

        // Reload policies
        boolean result = policyService.reloadPolicies();

        // Verify
        assertFalse(result);

        // Verify notification was sent
        verify(notificationService).notify(eq("admin"), contains("Failed to reload ABAC policies"));
    }
}
