package com.hotel.backendservice.client;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private ClientMapper clientMapper;

    @InjectMocks
    private ClientService clientService;

    private UUID clientId;
    private ClientDto clientDto;
    private ClientEntity clientEntity;

    @BeforeEach
    void setUp() {
        clientId = UUID.randomUUID();

        // Setup ClientDto
        clientDto = new ClientDto();
        clientDto.setId(clientId);
        clientDto.setFirstName("John");
        clientDto.setLastName("Doe");
        clientDto.setEmail("john.doe@example.com");
        clientDto.setPhones(new String[]{"123-456-7890"});
        clientDto.setNotes("Test client");

        // Setup ClientEntity
        clientEntity = new ClientEntity();
        clientEntity.setId(clientId);
        // Other entity properties would be set here in a real scenario
    }

    @Test
    void create_ShouldCreateClient_WhenValidDataProvided() {
        // Arrange
        when(clientMapper.toEntity(clientDto)).thenReturn(clientEntity);
        when(clientRepository.save(clientEntity)).thenReturn(clientEntity);
        when(clientMapper.toDto(clientEntity)).thenReturn(clientDto);

        // Act
        ClientDto result = clientService.create(clientDto);

        // Assert
        assertNotNull(result);
        assertEquals(clientId, result.getId());
        verify(clientRepository).save(clientEntity);
    }

    @Test
    void create_ShouldGenerateId_WhenIdIsNull() {
        // Arrange
        clientDto.setId(null);
        when(clientMapper.toEntity(clientDto)).thenReturn(clientEntity);
        when(clientRepository.save(clientEntity)).thenReturn(clientEntity);
        when(clientMapper.toDto(clientEntity)).thenReturn(clientDto);

        // Act
        ClientDto result = clientService.create(clientDto);

        // Assert
        assertNotNull(result);
        verify(clientRepository).save(clientEntity);
    }

    @Test
    void update_ShouldUpdateClient_WhenValidDataProvided() {
        // Arrange
        when(clientRepository.findById(clientId)).thenReturn(Optional.of(clientEntity));
        when(clientRepository.save(clientEntity)).thenReturn(clientEntity);
        when(clientMapper.toDto(clientEntity)).thenReturn(clientDto);

        // Act
        ClientDto result = clientService.update(clientId, clientDto);

        // Assert
        assertNotNull(result);
        assertEquals(clientId, result.getId());
        verify(clientMapper).updateEntity(clientDto, clientEntity);
        verify(clientRepository).save(clientEntity);
    }

    @Test
    void update_ShouldThrowException_WhenClientNotFound() {
        // Arrange
        when(clientRepository.findById(clientId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> clientService.update(clientId, clientDto));
        verify(clientRepository, never()).save(any());
    }

    @Test
    void findById_ShouldReturnClient_WhenClientExists() {
        // Arrange
        when(clientRepository.findById(clientId)).thenReturn(Optional.of(clientEntity));
        when(clientMapper.toDto(clientEntity)).thenReturn(clientDto);

        // Act
        ClientDto result = clientService.findById(clientId);

        // Assert
        assertNotNull(result);
        assertEquals(clientId, result.getId());
    }

    @Test
    void findById_ShouldThrowException_WhenClientNotFound() {
        // Arrange
        when(clientRepository.findById(clientId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> clientService.findById(clientId));
    }

    @Test
    void searchByName_ShouldReturnClients_WhenNameMatches() {
        // Arrange
        String name = "John";
        List<ClientEntity> clientEntities = Arrays.asList(clientEntity);
        
        when(clientRepository.findByNameFuzzy(name)).thenReturn(clientEntities);
        when(clientMapper.toDto(clientEntity)).thenReturn(clientDto);

        // Act
        List<ClientDto> results = clientService.searchByName(name);

        // Assert
        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
        assertEquals(clientId, results.get(0).getId());
    }
} 