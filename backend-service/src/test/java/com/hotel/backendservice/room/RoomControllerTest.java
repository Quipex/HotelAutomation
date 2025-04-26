package com.hotel.backendservice.room;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
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
    RoomDto dto = new RoomDto();
    dto.setId(roomId);
    dto.setNumber("101");
    dto.setType("STANDARD");
    dto.setCapacity(2);
    dto.setFloor(1);
    dto.setHasSeaView(true);

    when(svc.findAvailableRooms(any(LocalDate.class), anyInt(), anyInt()))
      .thenReturn(List.of(dto));

    // Act & Assert
    mvc.perform(get("/api/rooms/available")
        .param("fromDate", "2025-05-01")
        .param("numDays", "3")
        .param("guests", "2"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$[0].id").value(roomId.toString()))
      .andExpect(jsonPath("$[0].number").value("101"))
      .andExpect(jsonPath("$[0].type").value("STANDARD"))
      .andExpect(jsonPath("$[0].capacity").value(2))
      .andExpect(jsonPath("$[0].floor").value(1))
      .andExpect(jsonPath("$[0].hasSeaView").value(true));
  }
}
