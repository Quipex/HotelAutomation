package com.hotel.backendservice.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClientController.class)
@WithMockUser(username = "test-user", roles = {"ADMIN"})
class ClientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ClientService clientService;

    @Test
    void findById_ShouldReturnClient_WhenClientExists() throws Exception {
        // Given
        UUID clientId = UUID.fromString("5a65c9c5-0d9d-4084-b60b-9ab3f79a1bc5");
        ClientDto clientDto = new ClientDto();
        clientDto.setId(clientId);
        clientDto.setFirstName("John");
        clientDto.setLastName("Doe");
        clientDto.setPhones(new String[]{"123-456-7890"});
        clientDto.setEmail("john.doe@example.com");

        when(clientService.findById(clientId)).thenReturn(clientDto);

        // When & Then
        mockMvc.perform(get("/api/clients/{id}", clientId))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(clientId.toString()))
            .andExpect(jsonPath("$.firstName").value("John"))
            .andExpect(jsonPath("$.lastName").value("Doe"))
            .andExpect(jsonPath("$.email").value("john.doe@example.com"));
    }

    @Test
    void create_ShouldReturnCreatedClient_WhenValidInput() throws Exception {
        // Given
        ClientDto inputDto = new ClientDto();
        inputDto.setFirstName("Jane");
        inputDto.setLastName("Smith");
        inputDto.setPhones(new String[]{"234-567-8901"});
        inputDto.setEmail("jane.smith@example.com");

        UUID generatedId = UUID.randomUUID();
        ClientDto outputDto = new ClientDto();
        outputDto.setId(generatedId);
        outputDto.setFirstName("Jane");
        outputDto.setLastName("Smith");
        outputDto.setPhones(new String[]{"234-567-8901"});
        outputDto.setEmail("jane.smith@example.com");

        when(clientService.create(any(ClientDto.class))).thenReturn(outputDto);

        // When & Then
        mockMvc.perform(post("/api/clients")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(generatedId.toString()))
            .andExpect(jsonPath("$.firstName").value("Jane"))
            .andExpect(jsonPath("$.lastName").value("Smith"))
            .andExpect(jsonPath("$.email").value("jane.smith@example.com"));
    }

    @Test
    void update_ShouldReturnUpdatedClient_WhenValidInput() throws Exception {
        // Given
        UUID clientId = UUID.fromString("066f8ea6-39e9-40ed-9bbe-5351f4e6324e");
        ClientDto inputDto = new ClientDto();
        inputDto.setNotes("Updated notes");

        ClientDto outputDto = new ClientDto();
        outputDto.setId(clientId);
        outputDto.setFirstName("John");
        outputDto.setLastName("Doe");
        outputDto.setNotes("Updated notes");

        when(clientService.update(eq(clientId), any(ClientDto.class))).thenReturn(outputDto);

        // When & Then
        mockMvc.perform(patch("/api/clients/{id}", clientId)
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(clientId.toString()))
            .andExpect(jsonPath("$.firstName").value("John"))
            .andExpect(jsonPath("$.lastName").value("Doe"))
            .andExpect(jsonPath("$.notes").value("Updated notes"));
    }

    @Test
    void searchByName_ShouldReturnClients_WhenNameMatches() throws Exception {
        // Given
        String name = "John";
        ClientDto clientDto = new ClientDto();
        clientDto.setId(UUID.randomUUID());
        clientDto.setFirstName("John");
        clientDto.setLastName("Doe");

        when(clientService.searchByName(eq(name))).thenReturn(List.of(clientDto));

        // When & Then
        mockMvc.perform(get("/api/clients")
                .param("name", name))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$[0].firstName").value("John"))
            .andExpect(jsonPath("$[0].lastName").value("Doe"));
    }

    @Test
    void searchByName_ShouldReturnBadRequest_WhenNameIsBlank() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/clients")
                .param("name", ""))
            .andExpect(status().isBadRequest());
    }
}
