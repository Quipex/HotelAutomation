package com.hotel.backendservice.booking;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookingController.class)
class BookingControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private BookingService bookingService;

  private UUID bookingId;
  private BookingDto bookingDto;

  @BeforeEach
  void setUp() {
    bookingId = UUID.randomUUID();
    UUID clientId = UUID.randomUUID();
    UUID roomId = UUID.randomUUID();

    bookingDto = new BookingDto();
    bookingDto.setId(bookingId);
    bookingDto.setClientId(clientId);
    bookingDto.setRoomId(roomId);
    bookingDto.setCheckinDate(LocalDate.now().plusDays(1));
    bookingDto.setCheckoutDate(LocalDate.now().plusDays(3));
    bookingDto.setStatus("PENDING_PAYMENT");
    bookingDto.setSource("WEBSITE");
    bookingDto.setCost(new BigDecimal("150.00"));
    bookingDto.setNotes("Test booking");
  }

  @Test
  void findById_ShouldReturnBooking_WhenBookingExists() throws Exception {
    // Arrange
    when(bookingService.findById(bookingId)).thenReturn(bookingDto);

    // Act & Assert
    mockMvc.perform(get("/api/bookings/{id}", bookingId))
      .andExpect(status().isOk())
      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
      .andExpect(jsonPath("$.id").value(bookingId.toString()))
      .andExpect(jsonPath("$.status").value("PENDING_PAYMENT"));
  }

  @Test
  void create_ShouldReturnCreatedBooking_WhenValidInput() throws Exception {
    // Arrange
    when(bookingService.create(any(BookingDto.class))).thenReturn(bookingDto);

    // Act & Assert
    mockMvc.perform(post("/api/bookings")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(bookingDto)))
      .andExpect(status().isOk())
      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
      .andExpect(jsonPath("$.id").value(bookingId.toString()));
  }

  @Test
  void update_ShouldReturnUpdatedBooking_WhenValidInput() throws Exception {
    // Arrange
    when(bookingService.update(eq(bookingId), any(BookingDto.class))).thenReturn(bookingDto);

    // Act & Assert
    mockMvc.perform(patch("/api/bookings/{id}", bookingId)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(bookingDto)))
      .andExpect(status().isOk())
      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
      .andExpect(jsonPath("$.id").value(bookingId.toString()));
  }

  @Test
  void cancel_ShouldReturnNoContent_WhenBookingExists() throws Exception {
    // Act & Assert
    mockMvc.perform(post("/api/bookings/{id}/cancel", bookingId))
      .andExpect(status().isOk());
  }

  @Test
  void search_ShouldReturnBookings_WhenValidParameters() throws Exception {
    // Arrange
    LocalDate fromDate = LocalDate.now();
    Boolean prepaid = true;
    String source = "WEBSITE";
    when(bookingService.search(fromDate, prepaid, source)).thenReturn(Arrays.asList(bookingDto));

    // Act & Assert
    mockMvc.perform(get("/api/bookings")
        .param("from", fromDate.toString())
        .param("prepaid", prepaid.toString())
        .param("source", source))
      .andExpect(status().isOk())
      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
      .andExpect(jsonPath("$[0].id").value(bookingId.toString()));
  }
}
