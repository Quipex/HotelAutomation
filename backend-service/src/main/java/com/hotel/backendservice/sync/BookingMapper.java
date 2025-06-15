package com.hotel.backendservice.sync;

import com.hotel.backendservice.booking.BookingEntity;
import com.hotel.backendservice.client.ClientEntity;
import com.hotel.backendservice.room.RoomEntity;
import com.hotel.backendservice.sync.dto.BookingDto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Utility class for mapping between EasyMS DTOs and domain entities
 */
public final class BookingMapper {

    private BookingMapper() {
        // Private constructor to prevent instantiation
    }

    /**
     * Maps a BookingDto from EasyMS to a list of BookingEntity objects
     * Each room reservation in a booking becomes a separate BookingEntity
     */
    public static List<BookingEntity> toEntities(BookingDto dto, Map<String, RoomEntity> roomMap, Map<String, ClientEntity> clientMap) {
        if (dto.getRooms() == null || dto.getRooms().isEmpty()) {
            return new ArrayList<>();
        }
        
        // Create or get client entity
        ClientEntity clientEntity = getOrCreateClientEntity(dto, clientMap);
        
        return dto.getRooms().stream()
                .map(roomReservation -> mapToBookingEntity(dto, roomReservation, clientEntity, roomMap))
                .filter(Objects::nonNull) // Filter out nulls (rooms that couldn't be mapped)
                .collect(Collectors.toList());
    }
    
    private static BookingEntity mapToBookingEntity(
            BookingDto dto, 
            BookingDto.RoomReservationDto roomReservation,
            ClientEntity clientEntity,
            Map<String, RoomEntity> roomMap
    ) {
        // Skip if we don't have a room mapping
        RoomEntity roomEntity = roomMap.get(roomReservation.getRoomId());
        if (roomEntity == null) {
            return null;
        }
        
        BookingEntity entity = new BookingEntity();
        
        // Generate UUID based on the roomReservationId to ensure idempotency
        entity.setId(UUID.nameUUIDFromBytes(roomReservation.getRoomReservationId().getBytes()));
        entity.setClient(clientEntity);
        entity.setRoom(roomEntity);
        
        // Convert epoch millis to LocalDate
        if (roomReservation.getArrival() != null) {
            entity.setCheckinDate(
                    Instant.ofEpochMilli(roomReservation.getArrival())
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate()
            );
        }
        
        if (roomReservation.getDeparture() != null) {
            entity.setCheckoutDate(
                    Instant.ofEpochMilli(roomReservation.getDeparture())
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate()
            );
        }
        
        entity.setStatus(roomReservation.getStatus());
        entity.setSource(dto.getSource());
        
        // Set cost from invoice field
        if (roomReservation.getInvoice() != null) {
            entity.setCost(BigDecimal.valueOf(roomReservation.getInvoice()));
        }
        
        // Set notes from customer remarks
        if (dto.getCustomer() != null && dto.getCustomer().getRemarks() != null) {
            entity.setNotes(dto.getCustomer().getRemarks());
        }
        
        // Set IDs from EasyMS
        entity.setSourceSystemId(dto.getId());
        entity.setChannelId(roomReservation.getRoomReservationId());
        entity.setChannelName("EasyMS");
        
        return entity;
    }
    
    private static ClientEntity getOrCreateClientEntity(BookingDto dto, Map<String, ClientEntity> clientMap) {
        if (dto.getCustomer() == null) {
            return createDefaultClientEntity();
        }
        
        String clientKey = generateClientKey(dto.getCustomer());
        return clientMap.computeIfAbsent(clientKey, k -> createClientEntity(dto.getCustomer()));
    }
    
    private static String generateClientKey(BookingDto.CustomerDto customer) {
        // Create a key based on available client information
        return String.format("%s_%s_%s",
                customer.getName() != null ? customer.getName() : "",
                customer.getEmail() != null ? customer.getEmail() : "",
                customer.getTelephone() != null ? customer.getTelephone() : "");
    }
    
    private static ClientEntity createClientEntity(BookingDto.CustomerDto customer) {
        ClientEntity entity = new ClientEntity();
        entity.setId(UUID.randomUUID());
        
        // Parse the full name into components if possible
        String fullName = customer.getName() != null ? customer.getName() : "Unknown";
        String[] nameParts = fullName.split(" ", 3);
        
        if (nameParts.length > 0) {
            entity.setFirstName(nameParts[0]);
        }
        
        if (nameParts.length > 1) {
            entity.setLastName(nameParts[1]);
        }
        
        if (nameParts.length > 2) {
            entity.setMiddleName(nameParts[2]);
        }
        
        // Set phone
        if (customer.getTelephone() != null && !customer.getTelephone().isEmpty()) {
            entity.setPhone(customer.getTelephone());
        }
        
        entity.setEmail(customer.getEmail());
        entity.setNotes(customer.getRemarks());
        
        return entity;
    }
    
    private static ClientEntity createDefaultClientEntity() {
        ClientEntity entity = new ClientEntity();
        entity.setId(UUID.randomUUID());
        entity.setFirstName("Unknown");
        return entity;
    }
}
