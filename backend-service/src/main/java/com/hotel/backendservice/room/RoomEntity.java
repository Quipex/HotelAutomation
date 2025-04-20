package com.hotel.backendservice.room;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "room")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RoomEntity {
    @Id
    private UUID id;
    
    @Column(unique = true)
    private String number;
    
    private Integer floor;
    private Boolean hasSeaView;
    private String balconySide;
    private String type;
    private Integer maxAdults;
    private Integer capacity;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
} 