package com.hotel.backendservice.client;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientJooqRepository clientJooqRepository;
    private final ClientMapper clientMapper;

    /**
     * Create a new client
     *
     * @param dto The client data
     * @return The created client DTO
     */
    @Transactional
    public ClientDto create(ClientDto dto) {
        if (dto.getId() == null) {
            dto.setId(UUID.randomUUID());
        }

        ClientEntity entity = clientMapper.toEntity(dto);
        ClientEntity savedEntity = clientRepository.save(entity);
        return clientMapper.toDto(savedEntity);
    }

    /**
     * Update an existing client
     *
     * @param id  The client ID
     * @param dto The updated client data
     * @return The updated client DTO
     */
    @Transactional
    public ClientDto update(UUID id, ClientDto dto) {
        ClientEntity entity = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + id));

        dto.setId(id);
        clientMapper.updateEntity(dto, entity);

        ClientEntity savedEntity = clientRepository.save(entity);
        return clientMapper.toDto(savedEntity);
    }

    /**
     * Find a client by ID
     *
     * @param id The client ID
     * @return The client DTO
     */
    @Transactional(readOnly = true)
    public ClientDto findById(UUID id) {
        ClientEntity entity = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + id));

        return clientMapper.toDto(entity);
    }

    /**
     * Search clients by name using fuzzy matching
     *
     * @param name The name to search for
     * @return List of matching client DTOs
     */
    @Transactional(readOnly = true)
    public List<ClientDto> searchByName(String name) {
        return clientJooqRepository.findByNameFuzzy(name);
    }
}
