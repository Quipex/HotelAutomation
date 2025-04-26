package com.hotel.backendservice.client;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ClientMapper {

  ClientDto toDto(ClientEntity entity);

  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "fullName", ignore = true)
  ClientEntity toEntity(ClientDto dto);

  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "fullName", ignore = true)
  void updateEntity(ClientDto dto, @MappingTarget ClientEntity entity);
}
