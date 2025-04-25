package com.hotel.backendservice.room;

import java.util.UUID;

public interface RoomAvailabilityDto {
    UUID getRoomId();
    String getNumber();
    String getType();
    int getCapacity();
    int getFloor();
    boolean isHasSeaView();
} 