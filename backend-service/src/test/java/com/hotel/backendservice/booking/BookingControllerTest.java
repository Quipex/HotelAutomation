package com.hotel.backendservice.booking;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.backendservice.audit.AuditContextHolder;
import com.hotel.backendservice.security.abac.AbacAspect;
import com.hotel.backendservice.security.abac.PolicyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.expression.Expression;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookingController.class)
@Import(AbacAspect.class)
class BookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BookingService bookingService;

    @MockBean
    private PolicyService policyService;

    private final SpelExpressionParser parser = new SpelExpressionParser();
    private final Map<String, Expression> policies = new HashMap<>();

    private UUID bookingId;
    private BookingDto bookingDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup mock policies
        policies.put("view_booking", parser.parseExpression("true"));
        policies.put("create_booking", parser.parseExpression("true"));
        policies.put("modify_booking", parser.parseExpression("true"));
        policies.put("view_bookings", parser.parseExpression("true"));

        // Mock policy service to return our expressions
        when(policyService.getPolicy(anyString())).thenAnswer(invocation -> {
            String policyName = invocation.getArgument(0);
            return policies.get(policyName);
        });

        // Make evaluate return true for any policy
        when(policyService.evaluate(anyString(), any())).thenReturn(true);

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

        // Setup bookingService to populate audit context and return dto
        lenient().doAnswer(invocation -> {
            UUID id = invocation.getArgument(0);
            AuditContextHolder.setAttribute("bookingUserId", bookingDto.getClientId());
            return bookingDto;
        }).when(bookingService).findById(any(UUID.class));
    }

    @Test
    @WithMockUser(roles = "admin")
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
    @WithMockUser(roles = "user")
    void create_ShouldReturnCreatedBooking_WhenValidInput() throws Exception {
        // Arrange
        when(bookingService.create(any(BookingDto.class))).thenReturn(bookingDto);

        // Act & Assert
        mockMvc.perform(post("/api/bookings")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bookingDto)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(bookingId.toString()));
    }

    @Test
    @WithMockUser(roles = "manager")
    void update_ShouldReturnUpdatedBooking_WhenValidInput() throws Exception {
        // Arrange
        when(bookingService.update(eq(bookingId), any(BookingDto.class))).thenReturn(bookingDto);

        // Act & Assert
        mockMvc.perform(patch("/api/bookings/{id}", bookingId)
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bookingDto)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(bookingId.toString()));
    }

    @Test
    @WithMockUser(roles = "manager")
    void cancel_ShouldReturnNoContent_WhenBookingExists() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/bookings/{id}/cancel", bookingId)
                .with(SecurityMockMvcRequestPostProcessors.csrf()))
            .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "admin")
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
