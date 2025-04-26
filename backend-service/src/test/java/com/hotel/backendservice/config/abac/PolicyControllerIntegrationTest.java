package com.hotel.backendservice.config.abac;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PolicyControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PolicyService policyService;

    @Test
    void reloadPolicies_shouldReturn403WhenNoAdminHeaders() throws Exception {
        // Perform request without admin headers
        mockMvc.perform(post("/api/policies/reload")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        // Verify service was not called
        verify(policyService, never()).reloadPolicies();
    }

    @Test
    void reloadPolicies_shouldReturnSuccessWhenAdminUser() throws Exception {
        // Mock policy service to return success
        when(policyService.reloadPolicies()).thenReturn(true);

        // Perform request with admin headers
        mockMvc.perform(post("/api/policies/reload")
                .header("X-Platform", "telegram")
                .header("X-User-ID", "admin_chat_id")
                .header("X-User-Name", "Admin User")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("ABAC policies reloaded successfully"));

        // Verify service was called
        verify(policyService).reloadPolicies();
    }

    @Test
    void reloadPolicies_shouldReturnErrorWhenReloadFails() throws Exception {
        // Mock policy service to return failure
        when(policyService.reloadPolicies()).thenReturn(false);

        // Perform request with admin headers
        mockMvc.perform(post("/api/policies/reload")
                .header("X-Platform", "telegram")
                .header("X-User-ID", "admin_chat_id")
                .header("X-User-Name", "Admin User")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Failed to reload ABAC policies, check server logs"));

        // Verify service was called
        verify(policyService).reloadPolicies();
    }

    @Test
    void reloadPolicies_shouldReturn403WhenManagerUser() throws Exception {
        // Perform request with manager headers (not admin)
        mockMvc.perform(post("/api/policies/reload")
                .header("X-Platform", "telegram")
                .header("X-User-ID", "manager_chat_id")
                .header("X-User-Name", "Manager User")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        // Verify service was not called
        verify(policyService, never()).reloadPolicies();
    }
} 