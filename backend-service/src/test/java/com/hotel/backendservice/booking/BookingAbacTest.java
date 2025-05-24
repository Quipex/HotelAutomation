package com.hotel.backendservice.booking;

import com.hotel.backendservice.audit.AuditContextHolder;
import com.hotel.backendservice.security.abac.AbacAspect;
import com.hotel.backendservice.security.abac.AccessDeniedException;
import com.hotel.backendservice.security.abac.PolicyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;
import org.springframework.aop.framework.AopProxy;
import org.springframework.aop.framework.DefaultAopProxyFactory;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingAbacTest {

    @Mock
    private BookingService bookingService;

    @Mock
    private PolicyService policyService;

    @InjectMocks
    private BookingController bookingController;

    private BookingController proxy;
    private UUID bookingId;
    private BookingDto bookingDto;

    @BeforeEach
    void setUp() {
        // Create a proxy with the ABAC aspect
        AbacAspect abacAspect = new AbacAspect(policyService);

        AspectJProxyFactory factory = new AspectJProxyFactory(bookingController);
        factory.addAspect(abacAspect);
        AopProxy aopProxy = new DefaultAopProxyFactory().createAopProxy(factory);
        proxy = (BookingController) aopProxy.getProxy();

        // Initialize test data
        bookingId = UUID.randomUUID();
        UUID clientId = UUID.randomUUID();
        UUID roomId = UUID.randomUUID();

        // Setup Booking
        bookingDto = new BookingDto();
        bookingDto.setId(bookingId);
        bookingDto.setClientId(clientId);
        bookingDto.setRoomId(roomId);
        bookingDto.setCheckinDate(LocalDate.now());
        bookingDto.setCheckoutDate(LocalDate.now().plusDays(5));
        bookingDto.setStatus("CONFIRMED");
        bookingDto.setCost(BigDecimal.valueOf(500.00));
        bookingDto.setNotes("Test booking");

        // Set up mock behavior
        lenient().when(bookingService.findById(any(UUID.class))).thenReturn(bookingDto);
        lenient().when(bookingService.create(any(BookingDto.class))).thenReturn(bookingDto);

        // Set up audit context
        AuditContextHolder.AuditContext context = new AuditContextHolder.AuditContext();
        context.setUserId("user123");
        context.setUserName("Test User");
        context.setRole("user");
        AuditContextHolder.setContext(context);
    }

    @Test
    void findById_ShouldAllowAccess_WhenPolicyAllows() {
        // Arrange
        when(policyService.evaluate(eq("view_booking"), any())).thenReturn(true);

        // Act
        ResponseEntity<BookingDto> response = proxy.findById(bookingId);

        // Assert
        assertEquals(bookingDto, response.getBody());
        verify(policyService).evaluate(eq("view_booking"), any());
    }

    @Test
    void findById_ShouldDenyAccess_WhenPolicyDenies() {
        // Arrange
        when(policyService.evaluate(eq("view_booking"), any())).thenReturn(false);

        // Act & Assert
        assertThrows(AccessDeniedException.class, () -> proxy.findById(bookingId));
        verify(policyService).evaluate(eq("view_booking"), any());
    }

    @Test
    void create_ShouldAllowAccess_WhenPolicyAllows() {
        // Arrange
        when(policyService.evaluate(eq("create_booking"), any())).thenReturn(true);

        // Act
        ResponseEntity<BookingDto> response = proxy.create(bookingDto);

        // Assert
        assertEquals(bookingDto, response.getBody());
        verify(policyService).evaluate(eq("create_booking"), any());
    }

    @Test
    void create_ShouldDenyAccess_WhenPolicyDenies() {
        // Arrange
        when(policyService.evaluate(eq("create_booking"), any())).thenReturn(false);

        // Act & Assert
        assertThrows(AccessDeniedException.class, () -> proxy.create(bookingDto));
        verify(policyService).evaluate(eq("create_booking"), any());
    }

    @Test
    void roleAccess_AdminShouldHaveFullAccess() {
        // Arrange - modify context to be admin
        AuditContextHolder.AuditContext context = new AuditContextHolder.AuditContext();
        context.setUserId("admin123");
        context.setUserName("Admin User");
        context.setRole("admin");
        AuditContextHolder.setContext(context);

        // Make policy always return true for admin
        when(policyService.evaluate(anyString(), any())).thenReturn(true);

        // Act & Assert - check a few operations
        assertDoesNotThrow(() -> proxy.findById(bookingId));
        assertDoesNotThrow(() -> proxy.create(bookingDto));
        assertDoesNotThrow(() -> proxy.update(bookingId, bookingDto));
        assertDoesNotThrow(() -> proxy.cancel(bookingId));
    }
}
