package com.hotel.backendservice.config.abac;

import com.hotel.backendservice.audit.AuditContextHolder;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.expression.Expression;
import org.springframework.security.access.AccessDeniedException;

import java.lang.reflect.Method;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AbacAspectTest {

    @Mock
    private PolicyService policyService;

    @Mock
    private JoinPoint joinPoint;

    @Mock
    private MethodSignature methodSignature;

    @Mock
    private Expression expression;

    @InjectMocks
    private AbacAspect abacAspect;

    private AuditContextHolder.AuditContext auditContext;

    @BeforeEach
    void setUp() throws NoSuchMethodException {
        // Create lenient stubs for methods that might not be used in all tests
        lenient().when(methodSignature.getMethod()).thenReturn(TestService.class.getMethod("adminMethod"));
        lenient().when(joinPoint.getSignature()).thenReturn(methodSignature);
        
        // Setup empty method parameters
        lenient().when(methodSignature.getParameterNames()).thenReturn(new String[0]);
        lenient().when(joinPoint.getArgs()).thenReturn(new Object[0]);

        // Create audit context
        auditContext = new AuditContextHolder.AuditContext();
        auditContext.setPlatform("web");
        auditContext.setUserId("user123");
        auditContext.setUserName("Test User");
        auditContext.setUserNick("tester");
        
        // Set audit context
        AuditContextHolder.setContext(auditContext);
    }

    @AfterEach
    void tearDown() {
        // Clear audit context after each test
        AuditContextHolder.clearContext();
    }

    @Test
    void checkPermission_shouldAllowAccessWhenPolicyEvaluatesToTrue() throws NoSuchMethodException {
        // Get test method with @CheckPermission
        Method method = TestService.class.getMethod("adminMethod");
        
        // Setup mocks
        when(policyService.getPolicy("admin")).thenReturn(expression);
        when(expression.getValue(any(), eq(Boolean.class))).thenReturn(true);
        
        // Execute
        assertDoesNotThrow(() -> abacAspect.checkPermission(joinPoint));
        
        // Verify
        verify(policyService).getPolicy("admin");
        verify(expression).getValue(any(), eq(Boolean.class));
    }

    @Test
    void checkPermission_shouldDenyAccessWhenPolicyEvaluatesToFalse() throws NoSuchMethodException {
        // Get test method with @CheckPermission
        Method method = TestService.class.getMethod("adminMethod");
        
        // Setup mocks
        when(policyService.getPolicy("admin")).thenReturn(expression);
        when(expression.getValue(any(), eq(Boolean.class))).thenReturn(false);
        
        // Execute and verify
        AccessDeniedException exception = assertThrows(AccessDeniedException.class, 
                () -> abacAspect.checkPermission(joinPoint));
        
        assertTrue(exception.getMessage().contains("Access denied by policy"));
    }

    @Test
    void checkPermission_shouldThrowExceptionWhenPolicyNotFound() throws NoSuchMethodException {
        // Setup mocks
        when(policyService.getPolicy("admin")).thenReturn(null);
        
        // Execute and verify
        AccessDeniedException exception = assertThrows(AccessDeniedException.class, 
                () -> abacAspect.checkPermission(joinPoint));
        
        assertTrue(exception.getMessage().contains("Policy not found"));
    }

    @Test
    void checkPermission_shouldThrowExceptionWhenAuditContextMissing() throws NoSuchMethodException {
        // Clear audit context
        AuditContextHolder.clearContext();
        
        // Setup mocks
        when(policyService.getPolicy("admin")).thenReturn(expression);
        
        // Execute and verify
        AccessDeniedException exception = assertThrows(AccessDeniedException.class, 
                () -> abacAspect.checkPermission(joinPoint));
        
        assertTrue(exception.getMessage().contains("No audit context available"));
    }

    @Test
    void checkPermission_shouldHandleParametersInPolicyEvaluation() throws NoSuchMethodException {
        // Setup method with parameters
        Method method = TestService.class.getMethod("viewDataMethod", String.class);
        when(methodSignature.getMethod()).thenReturn(method);
        
        // Setup parameter names and values
        when(methodSignature.getParameterNames()).thenReturn(new String[]{"targetUserId"});
        when(joinPoint.getArgs()).thenReturn(new Object[]{"user123"});
        
        // Setup mocks for policy
        when(policyService.getPolicy("view_data")).thenReturn(expression);
        when(expression.getValue(any(), eq(Boolean.class))).thenReturn(true);
        
        // Execute
        assertDoesNotThrow(() -> abacAspect.checkPermission(joinPoint));
        
        // Verify
        verify(policyService).getPolicy("view_data");
    }
    
    /**
     * Test service class with methods annotated with @CheckPermission
     */
    static class TestService {
        
        @CheckPermission("admin")
        public void adminMethod() {
            // Admin only method
        }
        
        @CheckPermission("view_data")
        public void viewDataMethod(String targetUserId) {
            // Method with permission check based on parameter
        }
    }
} 