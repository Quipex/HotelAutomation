package com.hotel.backendservice.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.backendservice.config.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ClientControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void whenCreateClient_thenReturnsClient() throws Exception {
        // JSON-request to the controller
        String json = """
            {
              "firstName": "Anna",
              "lastName": "Karenina",
              "phone": "88005553535",
              "email": "anna.k@example.com"
            }
            """;

        // Call and checks
        mockMvc.perform(post("/api/clients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.firstName").value("Anna"))
            .andExpect(jsonPath("$.lastName").value("Karenina"))
            .andExpect(jsonPath("$.phone").value("88005553535"))
            .andExpect(jsonPath("$.email").value("anna.k@example.com"));
    }

    @Test
    void findById_ShouldReturnClient() throws Exception {
        // given
        ClientEntity client = new ClientEntity();
        client.setFirstName("John");
        client.setLastName("Doe");
        client.setEmail("john.doe@example.com");
        client.setPhone("123-456-7890");
        client = clientRepository.save(client);

        // when/then
        mockMvc.perform(get("/api/clients/{id}", client.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(client.getId().toString()))
            .andExpect(jsonPath("$.firstName").value("John"))
            .andExpect(jsonPath("$.lastName").value("Doe"))
            .andExpect(jsonPath("$.email").value("john.doe@example.com"))
            .andExpect(jsonPath("$.phone").value("123-456-7890"));
    }

    @Test
    void update_ShouldUpdateClient() throws Exception {
        // given
        ClientEntity client = new ClientEntity();
        client.setFirstName("Old");
        client.setLastName("Name");
        client = clientRepository.save(client);

        ClientDto updateDto = new ClientDto();
        updateDto.setFirstName("New");
        updateDto.setLastName("Name");
        updateDto.setEmail("new.name@example.com");

        // when/then
        mockMvc.perform(patch("/api/clients/{id}", client.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(client.getId().toString()))
            .andExpect(jsonPath("$.firstName").value("New"))
            .andExpect(jsonPath("$.lastName").value("Name"))
            .andExpect(jsonPath("$.email").value("new.name@example.com"));
    }
} 