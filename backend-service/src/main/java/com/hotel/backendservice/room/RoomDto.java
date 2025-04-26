package com.hotel.backendservice.room;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomDto {

  private UUID id;

  @NotNull(message = "Room number is required")
  @Size(min = 1, max = 20, message = "Room number must be between 1 and 20 characters")
  private String number;

  private Integer floor;

  private Boolean hasSeaView;

  private String balconySide;

  @NotNull(message = "Room type is required")
  @Size(min = 1, max = 50, message = "Room type must be between 1 and 50 characters")
  private String type;

  @NotNull(message = "Maximum number of adults is required")
  private Integer maxAdults;

  @NotNull(message = "Room capacity is required")
  private Integer capacity;

  @Size(max = 2000, message = "Notes should be less than 2000 characters")
  private String notes;
}
