package com.hotel.backendservice.room;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class RoomControllerTest {
  @Autowired
  private MockMvc mvc;
  @MockBean
  private RoomService svc;

  @Test
  void availableEndpointReturnsList() throws Exception {
    // Arrange
    UUID roomId = UUID.randomUUID();
    RoomAvailabilityDto dto = new RoomAvailabilityDto() {
      @Override
      public UUID getRoomId() {
        return roomId;
      }

      @Override
      public String getNumber() {
        return "101";
      }

      @Override
      public String getType() {
        return "STANDARD";
      }

      @Override
      public int getCapacity() {
        return 2;
      }

      @Override
      public int getFloor() {
        return 1;
      }

      @Override
      public boolean isHasSeaView() {
        return true;
      }
    };

    when(svc.findAvailable(any(), anyInt(), anyInt()))
      .thenReturn(List.of(dto));

    // Act & Assert
    mvc.perform(get("/api/rooms/available/dto")
        .param("fromDate", "2025-05-01")
        .param("numDays", "3")
        .param("guests", "2"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$[0].roomId").value(roomId.toString()))
      .andExpect(jsonPath("$[0].number").value("101"))
      .andExpect(jsonPath("$[0].type").value("STANDARD"))
      .andExpect(jsonPath("$[0].capacity").value(2))
      .andExpect(jsonPath("$[0].floor").value(1))
      .andExpect(jsonPath("$[0].hasSeaView").value(true));
  }
}
