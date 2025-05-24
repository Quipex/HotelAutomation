package com.hotel.backendservice.room;

import com.hotel.backendservice.config.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class RoomControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RoomService roomService;

    @Test
    void availableEndpointReturnsList() throws Exception {
        // given
        RoomDto room = new RoomDto();
        room.setId(UUID.randomUUID());
        room.setNumber("101");
        room.setType("Standard");

        when(roomService.findAvailableRooms(any(LocalDate.class), anyInt(), anyInt())).thenReturn(List.of(room));

        // when/then
        mockMvc.perform(get("/api/rooms/available")
                .param("fromDate", LocalDate.now().toString())
                .param("numDays", "1")
                .param("guests", "2"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].id").value(room.getId().toString()))
            .andExpect(jsonPath("$[0].number").value("101"))
            .andExpect(jsonPath("$[0].type").value("Standard"));
    }
}
