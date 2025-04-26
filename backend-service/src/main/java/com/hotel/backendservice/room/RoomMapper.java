package com.hotel.backendservice.room;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RoomMapper {

  RoomDto toDto(RoomEntity entity);

  RoomEntity toEntity(RoomDto dto);

  void updateEntity(RoomDto dto, @MappingTarget RoomEntity entity);
}
