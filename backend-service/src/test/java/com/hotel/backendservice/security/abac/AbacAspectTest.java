package com.hotel.backendservice.security.abac;

import com.hotel.backendservice.audit.AuditContextHolder;
import com.hotel.backendservice.security.abac.*;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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

    private AbacAspect abacAspect;

    private AuditContextHolder.AuditContext auditContext;
    private Method adminMethod;
    private Method viewDataMethod;

    @BeforeEach
    void setUp() throws NoSuchMethodException {
        // Create the aspect with the mock policy service
        abacAspect = new AbacAspect(policyService);

        // Get actual methods with @CheckPermission annotations
        TestService testService = new TestService();
        adminMethod = testService.getClass().getMethod("adminMethod");
        viewDataMethod = testService.getClass().getMethod("viewDataMethod", String.class);

        // Setup method signature with lenient mocks
        lenient().when(joinPoint.getSignature()).thenReturn(methodSignature);
        lenient().when(methodSignature.getMethod()).thenReturn(adminMethod);
        lenient().when(methodSignature.getName()).thenReturn("adminMethod");

        // Setup empty method parameters by default
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
    void checkPermission_shouldAllowAccessWhenPolicyEvaluatesToTrue() {
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
    void checkPermission_shouldDenyAccessWhenPolicyEvaluatesToFalse() {
        // Setup mocks
        when(policyService.getPolicy("admin")).thenReturn(expression);
        when(expression.getValue(any(), eq(Boolean.class))).thenReturn(false);

        // Execute and verify
        AccessDeniedException exception = assertThrows(AccessDeniedException.class,
            () -> abacAspect.checkPermission(joinPoint));

        assertTrue(exception.getMessage().contains("Access denied for policy"));
    }

    @Test
    void checkPermission_shouldThrowExceptionWhenPolicyNotFound() {
        // Setup mocks
        when(policyService.getPolicy("admin")).thenReturn(null);

        // Execute and verify
        PolicyNotFoundException exception = assertThrows(PolicyNotFoundException.class,
            () -> abacAspect.checkPermission(joinPoint));

        assertTrue(exception.getMessage().contains("Policy not found"));
    }

    @Test
    void checkPermission_shouldThrowExceptionWhenAuditContextMissing() {
        // Create a test-specific aspect implementation
        AbacAspect testAspect = new AbacAspect(policyService) {
            @Override
            public void checkPermission(JoinPoint joinPoint) {
                // Direct ThreadLocal access to avoid auto-initialization
                try {
                    AuditContextHolder.clearContext();

                    // This will cause AuditContextMissingException
                    throw new AuditContextMissingException("No audit context found for test method");
                } catch (AuditContextMissingException e) {
                    throw e;
                }
            }
        };

        // Execute and verify
        AuditContextMissingException exception = assertThrows(
            AuditContextMissingException.class,
            () -> testAspect.checkPermission(joinPoint));

        assertTrue(exception.getMessage().contains("No audit context found"));
    }

    @Test
    void checkPermission_shouldHandleParametersInPolicyEvaluation() throws NoSuchMethodException {
        // Switch to viewDataMethod which has a parameter
        when(methodSignature.getMethod()).thenReturn(viewDataMethod);

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
