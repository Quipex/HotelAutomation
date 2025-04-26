package com.hotel.backendservice.config.abac;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PolicyControllerTest {

    @InjectMocks
    private PolicyController policyController;

    @Mock
    private PolicyService policyService;

    @Test
    void reloadPolicies_shouldReturnSuccessWhenReloadSucceeds() {
        // Arrange
        when(policyService.reloadPolicies()).thenReturn(true);

        // Act
        ResponseEntity<Map<String, Object>> response = policyController.reloadPolicies();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(true, response.getBody().get("success"));
        assertEquals("ABAC policies reloaded successfully", response.getBody().get("message"));
        verify(policyService).reloadPolicies();
    }

    @Test
    void reloadPolicies_shouldReturnErrorWhenReloadFails() {
        // Arrange
        when(policyService.reloadPolicies()).thenReturn(false);

        // Act
        ResponseEntity<Map<String, Object>> response = policyController.reloadPolicies();

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(false, response.getBody().get("success"));
        assertEquals("Failed to reload ABAC policies, check server logs", response.getBody().get("message"));
        verify(policyService).reloadPolicies();
    }
} 