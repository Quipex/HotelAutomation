package com.hotel.backendservice.room;

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

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RoomAbacTest {

    @Mock
    private RoomService roomService;

    @Mock
    private PolicyService policyService;

    @InjectMocks
    private RoomController roomController;

    private AbacAspect abacAspect;
    private RoomController proxy;
    private UUID roomId;
    private RoomDto roomDto;

    @BeforeEach
    void setUp() {
        // Create a proxy with the ABAC aspect
        abacAspect = new AbacAspect(policyService);

        AspectJProxyFactory factory = new AspectJProxyFactory(roomController);
        factory.addAspect(abacAspect);
        AopProxy aopProxy = new DefaultAopProxyFactory().createAopProxy(factory);
        proxy = (RoomController) aopProxy.getProxy();

        // Initialize test data
        roomId = UUID.randomUUID();

        // Setup Room
        roomDto = new RoomDto();
        roomDto.setId(roomId);
        roomDto.setNumber("101");
        roomDto.setFloor(1);
        roomDto.setType("Standard");
        roomDto.setCapacity(2);
        roomDto.setMaxAdults(2);
        roomDto.setHasSeaView(true);
        roomDto.setBalconySide("East");
        roomDto.setNotes("Comfortable standard room with city view");

        // Set up mock behavior
        lenient().when(roomService.findById(any(UUID.class))).thenReturn(roomDto);
        lenient().when(roomService.searchByNumber(anyString())).thenReturn(Arrays.asList(roomDto));
        lenient().when(roomService.findAvailableRooms(any(LocalDate.class), anyInt(), anyInt()))
            .thenReturn(Arrays.asList(roomDto));

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
        when(policyService.evaluate(eq("view_room"), any())).thenReturn(true);

        // Act
        ResponseEntity<RoomDto> response = proxy.findById(roomId);

        // Assert
        assertEquals(roomDto, response.getBody());
        verify(policyService).evaluate(eq("view_room"), any());
    }

    @Test
    void findById_ShouldDenyAccess_WhenPolicyDenies() {
        // Arrange
        when(policyService.evaluate(eq("view_room"), any())).thenReturn(false);

        // Act & Assert
        assertThrows(AccessDeniedException.class, () -> proxy.findById(roomId));
        verify(policyService).evaluate(eq("view_room"), any());
    }

    @Test
    void searchByNumber_ShouldAllowAccess_WhenPolicyAllows() {
        // Arrange
        when(policyService.evaluate(eq("view_rooms"), any())).thenReturn(true);
        String roomNumber = "10";

        // Act
        ResponseEntity<List<RoomDto>> response = proxy.searchByNumber(roomNumber);

        // Assert
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(policyService).evaluate(eq("view_rooms"), any());
    }

    @Test
    void searchByNumber_ShouldDenyAccess_WhenPolicyDenies() {
        // Arrange
        when(policyService.evaluate(eq("view_rooms"), any())).thenReturn(false);
        String roomNumber = "10";

        // Act & Assert
        assertThrows(AccessDeniedException.class, () -> proxy.searchByNumber(roomNumber));
        verify(policyService).evaluate(eq("view_rooms"), any());
    }

    @Test
    void findAvailableRooms_ShouldAllowAccess_WhenPolicyAllows() {
        // Arrange
        when(policyService.evaluate(eq("view_available_rooms"), any())).thenReturn(true);
        LocalDate fromDate = LocalDate.now().plusDays(1);
        int numDays = 3;
        int guests = 2;

        // Act
        ResponseEntity<List<RoomDto>> response = proxy.findAvailableRooms(fromDate, numDays, guests);

        // Assert
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(policyService).evaluate(eq("view_available_rooms"), any());
    }

    @Test
    void findAvailableRooms_ShouldDenyAccess_WhenPolicyDenies() {
        // Arrange
        when(policyService.evaluate(eq("view_available_rooms"), any())).thenReturn(false);
        LocalDate fromDate = LocalDate.now().plusDays(1);
        int numDays = 3;
        int guests = 2;

        // Act & Assert
        assertThrows(AccessDeniedException.class, () -> proxy.findAvailableRooms(fromDate, numDays, guests));
        verify(policyService).evaluate(eq("view_available_rooms"), any());
    }

    @Test
    void roleAccess_AdminShouldHaveFullAccess() {
        // Arrange - Set admin role
        AuditContextHolder.AuditContext context = new AuditContextHolder.AuditContext();
        context.setUserId("admin123");
        context.setUserName("Admin User");
        context.setRole("admin");
        AuditContextHolder.setContext(context);

        when(policyService.evaluate(anyString(), any())).thenReturn(true);

        // Act & Assert - Should access all endpoints
        LocalDate fromDate = LocalDate.now().plusDays(1);
        assertDoesNotThrow(() -> proxy.findById(roomId));
        assertDoesNotThrow(() -> proxy.searchByNumber("10"));
        assertDoesNotThrow(() -> proxy.findAvailableRooms(fromDate, 3, 2));

        // Verify policy service was called for each method
        verify(policyService, times(3)).evaluate(anyString(), any());
    }
}
