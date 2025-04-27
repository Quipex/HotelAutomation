package com.hotel.backendservice.booking;

import com.hotel.backendservice.client.ClientEntity;
import com.hotel.backendservice.room.RoomEntity;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.UUID;

@Mapper(componentModel = "spring",
    imports = {UUID.class})
public interface BookingMapper {

    @Mapping(source = "client.id", target = "clientId")
    @Mapping(source = "room.id", target = "roomId")
    BookingDto toDto(BookingEntity entity);

    @Mapping(target = "client", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    BookingEntity toEntity(BookingDto dto);

    @Mapping(target = "client", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(BookingDto dto, @MappingTarget BookingEntity entity);

    @AfterMapping
    default void setClientAndRoom(@MappingTarget BookingEntity entity, BookingDto dto) {
        if (dto.getClientId() != null) {
            ClientEntity client = new ClientEntity();
            client.setId(dto.getClientId());
            entity.setClient(client);
        }

        if (dto.getRoomId() != null) {
            RoomEntity room = new RoomEntity();
            room.setId(dto.getRoomId());
            entity.setRoom(room);
        }
    }
}
