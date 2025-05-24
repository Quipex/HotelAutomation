package com.hotel.backendservice.booking;

import com.hotel.backendservice.audit.*;
import com.hotel.backendservice.security.abac.PolicyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;
import org.springframework.aop.framework.AopProxy;
import org.springframework.aop.framework.DefaultAopProxyFactory;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingAuditTest {

    @Mock
    private BookingService bookingService;

    @Mock
    private PolicyService policyService;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private BookingController bookingController;

    @Spy
    private AuditAspect auditAspect;

    private BookingController proxy;
    private UUID bookingId;
    private BookingDto bookingDto;

    @BeforeEach
    void setUp() {
        // Create a proxy with the Audit aspect
        auditAspect = new AuditAspect(auditService, new com.fasterxml.jackson.databind.ObjectMapper());

        AspectJProxyFactory factory = new AspectJProxyFactory(bookingController);
        factory.addAspect(auditAspect);
        AopProxy aopProxy = new DefaultAopProxyFactory().createAopProxy(factory);
        proxy = (BookingController) aopProxy.getProxy();

        // Mock the policy service to allow all operations - use lenient for all setups
        lenient().when(policyService.evaluate(anyString(), any())).thenReturn(true);

        // Initialize test data
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

        // Set up default mock behavior with lenient
        lenient().when(bookingService.findById(any(UUID.class))).thenReturn(bookingDto);
        lenient().when(bookingService.create(any(BookingDto.class))).thenReturn(bookingDto);
        lenient().when(bookingService.update(any(UUID.class), any(BookingDto.class))).thenReturn(bookingDto);
        lenient().doNothing().when(bookingService).cancel(any(UUID.class));

        // Set up audit context
        AuditContextHolder.AuditContext context = new AuditContextHolder.AuditContext();
        context.setUserId("user123");
        context.setUserName("Test User");
        context.setPlatform("web");
        context.setIpAddress("127.0.0.1");
        AuditContextHolder.setContext(context);

        // Setup lenient mock for audit actor and log creation
        mockGetOrCreateActor();
    }

    @Test
    void findById_ShouldAudit_WhenCalled() {
        // Act
        ResponseEntity<BookingDto> response = proxy.findById(bookingId);

        // Assert
        assertEquals(bookingDto, response.getBody());

        // Verify audit was created with correct parameters
        verify(auditService).createAuditLog(any(), eq("view"), eq("booking"), eq(bookingId.toString()), anyString());
    }

    @Test
    void create_ShouldAudit_WhenCalled() {
        // Act
        ResponseEntity<BookingDto> response = proxy.create(bookingDto);

        // Assert
        assertEquals(bookingDto, response.getBody());

        // Verify audit was created with correct parameters
        verify(auditService).createAuditLog(any(), eq("create"), eq("booking"), eq(bookingDto.getId().toString()), anyString());
    }

    @Test
    void update_ShouldAudit_WhenCalled() {
        // Act
        ResponseEntity<BookingDto> response = proxy.update(bookingId, bookingDto);

        // Assert
        assertEquals(bookingDto, response.getBody());

        // Verify audit was created with correct parameters
        verify(auditService).createAuditLog(any(), eq("update"), eq("booking"), eq(bookingId.toString()), anyString());
    }

    @Test
    void cancel_ShouldAudit_WhenCalled() {
        // Act
        ResponseEntity<Void> response = proxy.cancel(bookingId);

        // Assert
        assertTrue(response.getStatusCode().is2xxSuccessful());

        // Verify audit was created with correct parameters
        verify(auditService).createAuditLog(any(), eq("cancel"), eq("booking"), eq(bookingId.toString()), anyString());
    }

    @Test
    void search_ShouldAudit_WhenCalled() {
        // Arrange
        LocalDate fromDate = LocalDate.now();
        Boolean prepaid = true;
        String source = "WEBSITE";

        // Act
        proxy.search(fromDate, prepaid, source);

        // Assert
        ArgumentCaptor<String> detailsCaptor = ArgumentCaptor.forClass(String.class);
        verify(auditService).createAuditLog(any(), eq("search"), eq("bookings"), isNull(), detailsCaptor.capture());

        // Verify search parameters are in the audit details
        String details = detailsCaptor.getValue();
        assertNotNull(details);
        assertTrue(details.contains(fromDate.toString()));
        assertTrue(details.contains(source));
    }

    @Test
    void auditableActionAnnotation_ShouldBePresent_OnAllMethods() {
        // Verify all controller methods have @AuditableAction annotation
        assertNotNull(getAuditableActionValue(BookingController.class, "findById", UUID.class));
        assertNotNull(getAuditableActionValue(BookingController.class, "create", BookingDto.class));
        assertNotNull(getAuditableActionValue(BookingController.class, "update", UUID.class, BookingDto.class));
        assertNotNull(getAuditableActionValue(BookingController.class, "cancel", UUID.class));
        assertNotNull(getAuditableActionValue(BookingController.class, "search", LocalDate.class, Boolean.class, String.class));
    }

    @Test
    void contextManagement_ShouldClearAuditContext_AfterMethodExecution() {
        // Arrange
        AuditContextHolder.setAttribute("testKey", "testValue");

        // Act
        proxy.findById(bookingId);

        // Assert - context should be cleared
        assertNull(AuditContextHolder.getContext().getAttributes().get("testKey"));
    }

    @Test
    void contextManagement_ShouldClearAuditContext_EvenWhenExceptionThrown() {
        // Arrange
        when(bookingService.findById(any(UUID.class))).thenThrow(new RuntimeException("Test exception"));
        AuditContextHolder.setAttribute("testKey", "testValue");

        // Act
        try {
            proxy.findById(bookingId);
            fail("Should have thrown exception");
        } catch (RuntimeException e) {
            // Expected
        }

        // Assert - context should be cleared even after exception
        assertNull(AuditContextHolder.getContext().getAttributes().get("testKey"));
    }

    private AuditableAction getAuditableActionValue(Class<?> clazz, String methodName, Class<?>... parameterTypes) {
        try {
            return clazz.getMethod(methodName, parameterTypes).getAnnotation(AuditableAction.class);
        } catch (NoSuchMethodException e) {
            fail("Method not found: " + methodName);
            return null;
        }
    }

    private void mockGetOrCreateActor() {
        // Mock audit service to return dummy actor and log
        lenient().when(auditService.getOrCreateActor(anyString(), anyString(), anyString(), anyString(), anyString(), anyString())).thenReturn(mock(com.hotel.backendservice.audit.AuditActorEntity.class));

        lenient().when(auditService.createAuditLog(any(), anyString(), anyString(), anyString(), anyString())).thenReturn(mock(AuditLogEntity.class));
    }
}
