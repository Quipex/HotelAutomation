package com.hotel.backendservice.client;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClientControllerTest {

    @Mock
    private ClientService clientService;

    @InjectMocks
    private ClientController clientController;

    private UUID clientId;
    private ClientDto clientDto;

    @BeforeEach
    void setUp() {
        clientId = UUID.randomUUID();

        // Setup test data
        clientDto = new ClientDto();
        clientDto.setId(clientId);
        clientDto.setFirstName("John");
        clientDto.setLastName("Doe");
        clientDto.setEmail("john.doe@example.com");
        clientDto.setPhone("123-456-7890");
        clientDto.setPhone2("098-765-4321");
        clientDto.setNotes("Test client");
    }

    @Test
    void findById_ShouldReturnClient() {
        // Arrange
        when(clientService.findById(clientId)).thenReturn(clientDto);

        // Act
        ResponseEntity<ClientDto> response = clientController.findById(clientId);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(clientDto, response.getBody());
    }

    @Test
    void update_ShouldReturnUpdatedClient() {
        // Arrange
        when(clientService.update(any(UUID.class), any(ClientDto.class))).thenReturn(clientDto);

        // Act
        ResponseEntity<ClientDto> response = clientController.update(clientId, clientDto);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(clientDto, response.getBody());
    }
}
