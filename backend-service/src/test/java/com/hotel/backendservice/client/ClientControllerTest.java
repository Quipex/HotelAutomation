package com.hotel.backendservice.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClientController.class)
class ClientControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private ClientService clientService;

  private UUID clientId;
  private ClientDto clientDto;

  @BeforeEach
  void setUp() {
    clientId = UUID.randomUUID();

    clientDto = new ClientDto();
    clientDto.setId(clientId);
    clientDto.setFirstName("John");
    clientDto.setLastName("Doe");
    clientDto.setEmail("john.doe@example.com");
    clientDto.setPhones(new String[]{"123-456-7890"});
    clientDto.setNotes("Test client");
  }

  @Test
  void findById_ShouldReturnClient_WhenClientExists() throws Exception {
    // Arrange
    when(clientService.findById(clientId)).thenReturn(clientDto);

    // Act & Assert
    mockMvc.perform(get("/api/clients/{id}", clientId))
      .andExpect(status().isOk())
      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
      .andExpect(jsonPath("$.id").value(clientId.toString()))
      .andExpect(jsonPath("$.firstName").value("John"))
      .andExpect(jsonPath("$.lastName").value("Doe"));
  }

  @Test
  void create_ShouldReturnCreatedClient_WhenValidInput() throws Exception {
    // Arrange
    ClientDto inputDto = new ClientDto();
    inputDto.setFirstName("Jane");
    inputDto.setLastName("Smith");
    inputDto.setEmail("jane.smith@example.com");
    inputDto.setPhones(new String[]{"234-567-8901"});

    ClientDto createdDto = new ClientDto();
    createdDto.setId(UUID.randomUUID());
    createdDto.setFirstName("Jane");
    createdDto.setLastName("Smith");
    createdDto.setEmail("jane.smith@example.com");
    createdDto.setPhones(new String[]{"234-567-8901"});

    when(clientService.create(any(ClientDto.class))).thenReturn(createdDto);

    // Act & Assert
    mockMvc.perform(post("/api/clients")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(inputDto)))
      .andExpect(status().isOk())
      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
      .andExpect(jsonPath("$.id").exists())
      .andExpect(jsonPath("$.firstName").value("Jane"))
      .andExpect(jsonPath("$.lastName").value("Smith"));
  }

  @Test
  void update_ShouldReturnUpdatedClient_WhenValidInput() throws Exception {
    // Arrange
    ClientDto updateDto = new ClientDto();
    updateDto.setNotes("Updated notes");

    ClientDto updatedDto = new ClientDto();
    updatedDto.setId(clientId);
    updatedDto.setFirstName("John");
    updatedDto.setLastName("Doe");
    updatedDto.setEmail("john.doe@example.com");
    updatedDto.setPhones(new String[]{"123-456-7890"});
    updatedDto.setNotes("Updated notes");

    when(clientService.update(eq(clientId), any(ClientDto.class))).thenReturn(updatedDto);

    // Act & Assert
    mockMvc.perform(patch("/api/clients/{id}", clientId)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(updateDto)))
      .andExpect(status().isOk())
      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
      .andExpect(jsonPath("$.id").value(clientId.toString()))
      .andExpect(jsonPath("$.notes").value("Updated notes"));
  }

  @Test
  void searchByName_ShouldReturnClients_WhenNameMatches() throws Exception {
    // Arrange
    String name = "John";
    when(clientService.searchByName(name)).thenReturn(Arrays.asList(clientDto));

    // Act & Assert
    mockMvc.perform(get("/api/clients")
        .param("name", name))
      .andExpect(status().isOk())
      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
      .andExpect(jsonPath("$[0].id").value(clientId.toString()))
      .andExpect(jsonPath("$[0].firstName").value("John"));
  }

  @Test
  void searchByName_ShouldReturnBadRequest_WhenNameIsBlank() throws Exception {
    // Act & Assert
    mockMvc.perform(get("/api/clients")
        .param("name", ""))
      .andExpect(status().isBadRequest());
  }
}
