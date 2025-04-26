package com.hotel.backendservice.audit;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Method;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditAspectTest {

    @Mock
    private AuditService auditService;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private JoinPoint joinPoint;

    @Mock
    private MethodSignature methodSignature;

    @InjectMocks
    private AuditAspect auditAspect;

    @BeforeEach
    void setUp() throws Exception {
        // Set up AuditContextHolder with a test context
        AuditContextHolder.AuditContext context = new AuditContextHolder.AuditContext();
        context.setPlatform("test");
        context.setUserId("test-user");
        context.setUserName("Test User");
        context.setUserNick("test-nick");
        context.setUserAgent("test-agent");
        context.setIpAddress("127.0.0.1");
        AuditContextHolder.setContext(context);

        // Create a mock actor entity to be returned by the service
        AuditActorEntity actor = new AuditActorEntity();
        actor.setId(1L);
        when(auditService.getOrCreateActor(
                eq("test"), eq("test-user"), eq("Test User"), eq("test-nick"), eq("test-agent"), eq("127.0.0.1")
        )).thenReturn(actor);

        // Set up method signature mock
        when(joinPoint.getSignature()).thenReturn(methodSignature);
        
        // Mock the method to have the @AuditableAction annotation
        Method testMethod = TestService.class.getMethod("testMethod", String.class);
        when(methodSignature.getMethod()).thenReturn(testMethod);
        
        // Mock parameter names and args
        when(methodSignature.getParameterNames()).thenReturn(new String[]{"testParam"});
        when(joinPoint.getArgs()).thenReturn(new Object[]{"test-value"});
        
        // Mock objectMapper
        when(objectMapper.writeValueAsString(any())).thenReturn("{\"testParam\":\"test-value\"}");
    }

    @Test
    void auditMethod_shouldCreateAuditLog() throws Exception {
        // Mock return value
        UUID testUuid = UUID.randomUUID();
        
        // Execute the aspect method
        auditAspect.auditMethod(joinPoint, testUuid);
        
        // Verify that the auditService was called with the correct parameters
        ArgumentCaptor<AuditActorEntity> actorCaptor = ArgumentCaptor.forClass(AuditActorEntity.class);
        ArgumentCaptor<String> actionCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> objectTypeCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> objectIdCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> detailsCaptor = ArgumentCaptor.forClass(String.class);
        
        verify(auditService).createAuditLog(
                actorCaptor.capture(),
                actionCaptor.capture(),
                objectTypeCaptor.capture(),
                objectIdCaptor.capture(),
                detailsCaptor.capture()
        );
        
        // Verify the captured values
        assertEquals(1L, actorCaptor.getValue().getId());
        assertEquals("test-action", actionCaptor.getValue());
        assertEquals("test-object", objectTypeCaptor.getValue());
        assertEquals(testUuid.toString(), objectIdCaptor.getValue());
        assertEquals("{\"testParam\":\"test-value\"}", detailsCaptor.getValue());
    }
    
    // Test service class for the test
    public static class TestService {
        @AuditableAction(action = "test-action", objectType = "test-object")
        public UUID testMethod(String testParam) {
            return UUID.randomUUID();
        }
    }
} 