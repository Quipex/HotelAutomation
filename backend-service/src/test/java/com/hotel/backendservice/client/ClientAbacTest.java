package com.hotel.backendservice.client;

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

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ClientAbacTest {

    @Mock
    private ClientService clientService;

    @Mock
    private PolicyService policyService;

    @InjectMocks
    private ClientController clientController;

    private AbacAspect abacAspect;
    private ClientController proxy;
    private UUID clientId;
    private ClientDto clientDto;

    @BeforeEach
    void setUp() {
        // Create a proxy with the ABAC aspect
        abacAspect = new AbacAspect(policyService);

        AspectJProxyFactory factory = new AspectJProxyFactory(clientController);
        factory.addAspect(abacAspect);
        AopProxy aopProxy = new DefaultAopProxyFactory().createAopProxy(factory);
        proxy = (ClientController) aopProxy.getProxy();

        // Initialize test data
        clientId = UUID.randomUUID();
        clientDto = new ClientDto();
        clientDto.setId(clientId);
        clientDto.setFirstName("John");
        clientDto.setLastName("Doe");
        clientDto.setMiddleName("James");
        clientDto.setEmail("john.doe@example.com");
        clientDto.setPhones(new String[]{"+1234567890"});
        clientDto.setNotes("VIP client");

        // Set up mock behavior
        lenient().when(clientService.findById(any(UUID.class))).thenReturn(clientDto);
        lenient().when(clientService.create(any(ClientDto.class))).thenReturn(clientDto);
        lenient().when(clientService.update(any(UUID.class), any(ClientDto.class))).thenReturn(clientDto);
        lenient().when(clientService.searchByName(anyString())).thenReturn(Arrays.asList(clientDto));

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
        when(policyService.evaluate(eq("view_client"), any())).thenReturn(true);

        // Act
        ResponseEntity<ClientDto> response = proxy.findById(clientId);

        // Assert
        assertEquals(clientDto, response.getBody());
        verify(policyService).evaluate(eq("view_client"), any());
    }

    @Test
    void findById_ShouldDenyAccess_WhenPolicyDenies() {
        // Arrange
        when(policyService.evaluate(eq("view_client"), any())).thenReturn(false);

        // Act & Assert
        assertThrows(AccessDeniedException.class, () -> proxy.findById(clientId));
        verify(policyService).evaluate(eq("view_client"), any());
    }

    @Test
    void searchByName_ShouldAllowAccess_WhenPolicyAllows() {
        // Arrange
        when(policyService.evaluate(eq("search_clients"), any())).thenReturn(true);

        // Act
        ResponseEntity<List<ClientDto>> response = proxy.searchByName("John");

        // Assert
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(policyService).evaluate(eq("search_clients"), any());
    }

    @Test
    void searchByName_ShouldDenyAccess_WhenPolicyDenies() {
        // Arrange
        when(policyService.evaluate(eq("search_clients"), any())).thenReturn(false);

        // Act & Assert
        assertThrows(AccessDeniedException.class, () -> proxy.searchByName("John"));
        verify(policyService).evaluate(eq("search_clients"), any());
    }

    @Test
    void create_ShouldAllowAccess_WhenPolicyAllows() {
        // Arrange
        when(policyService.evaluate(eq("create_client"), any())).thenReturn(true);

        // Act
        ResponseEntity<ClientDto> response = proxy.create(clientDto);

        // Assert
        assertEquals(clientDto, response.getBody());
        verify(policyService).evaluate(eq("create_client"), any());
    }

    @Test
    void create_ShouldDenyAccess_WhenPolicyDenies() {
        // Arrange
        when(policyService.evaluate(eq("create_client"), any())).thenReturn(false);

        // Act & Assert
        assertThrows(AccessDeniedException.class, () -> proxy.create(clientDto));
        verify(policyService).evaluate(eq("create_client"), any());
    }

    @Test
    void update_ShouldAllowAccess_WhenPolicyAllows() {
        // Arrange
        when(policyService.evaluate(eq("update_client"), any())).thenReturn(true);

        // Act
        ResponseEntity<ClientDto> response = proxy.update(clientId, clientDto);

        // Assert
        assertEquals(clientDto, response.getBody());
        verify(policyService).evaluate(eq("update_client"), any());
    }

    @Test
    void update_ShouldDenyAccess_WhenPolicyDenies() {
        // Arrange
        when(policyService.evaluate(eq("update_client"), any())).thenReturn(false);

        // Act & Assert
        assertThrows(AccessDeniedException.class, () -> proxy.update(clientId, clientDto));
        verify(policyService).evaluate(eq("update_client"), any());
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
        assertDoesNotThrow(() -> proxy.findById(clientId));
        assertDoesNotThrow(() -> proxy.searchByName("John"));
        assertDoesNotThrow(() -> proxy.create(clientDto));
        assertDoesNotThrow(() -> proxy.update(clientId, clientDto));

        // Verify policy service was called for each method
        verify(policyService, times(4)).evaluate(anyString(), any());
    }
}
