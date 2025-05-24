package com.hotel.backendservice.audit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Aspect that intercepts methods annotated with @AuditableAction
 * and logs the action to the audit log.
 */
@Aspect
@Component
@Slf4j
public class AuditAspect {

    private final AuditService auditService;
    private final ObjectMapper objectMapper;
    private final ExpressionParser expressionParser;

    /**
     * Default constructor for tests
     */
    public AuditAspect() {
        this.auditService = null;
        this.objectMapper = null;
        this.expressionParser = new SpelExpressionParser();
    }

    /**
     * Main constructor used by Spring
     */
    public AuditAspect(AuditService auditService, ObjectMapper objectMapper) {
        this.auditService = auditService;
        this.objectMapper = objectMapper;
        this.expressionParser = new SpelExpressionParser();
    }

    /**
     * After a method with @AuditableAction successfully returns,
     * log the action to the audit log.
     */
    @AfterReturning(
        pointcut = "@annotation(com.hotel.backendservice.audit.AuditableAction)",
        returning = "result"
    )
    public void auditMethod(JoinPoint joinPoint, Object result) {
        try {
            if (auditService == null || objectMapper == null) {
                log.warn("AuditAspect not properly initialized for method {}",
                    ((MethodSignature) joinPoint.getSignature()).getMethod().getName());
                return;
            }

            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            Method method = signature.getMethod();
            AuditableAction auditableAction = method.getAnnotation(AuditableAction.class);

            String action = auditableAction.action();
            String objectType = auditableAction.objectType();

            // Get the current audit context
            AuditContextHolder.AuditContext context = AuditContextHolder.getContext();

            // Create or get actor
            AuditActorEntity actor = auditService.getOrCreateActor(
                context.getPlatform(),
                context.getUserId(),
                context.getUserName(),
                context.getUserNick(),
                context.getUserAgent(),
                context.getIpAddress()
            );

            // Extract object ID using SpEL if provided, otherwise try to find it in arguments
            String objectId = extractObjectId(auditableAction, joinPoint, result);

            // Extract details using SpEL if provided, otherwise use method arguments
            String details = extractDetails(auditableAction, joinPoint, result);

            // Create audit log entry
            auditService.createAuditLog(actor, action, objectType, objectId, details);

        } catch (Exception e) {
            log.error("Error creating audit log entry", e);
        }
    }

    /**
     * Extract the object ID using SpEL or by looking for an ID field in arguments or result
     */
    private String extractObjectId(AuditableAction auditableAction, JoinPoint joinPoint, Object result) {
        if (!auditableAction.objectIdExpression().isEmpty()) {
            return evaluateExpression(auditableAction.objectIdExpression(), joinPoint, result);
        }

        // Try to find ID in the result or arguments
        if (result != null) {
            try {
                // Try to get ID from result using reflection
                try {
                    Object idValue = result.getClass().getMethod("getId").invoke(result);
                    if (idValue != null) {
                        return idValue.toString();
                    }
                } catch (Exception e) {
                    // Ignore, will try other methods
                }

                // If result is a UUID or String, use it directly
                if (result instanceof UUID || result instanceof String) {
                    return result.toString();
                }
            } catch (Exception e) {
                log.debug("Could not extract ID from result", e);
            }
        }

        // Try to find ID in arguments
        Object[] args = joinPoint.getArgs();
        for (Object arg : args) {
            if (arg == null) continue;

            // If argument is a UUID or String, use it
            if (arg instanceof UUID || arg instanceof String) {
                return arg.toString();
            }

            // Try to get ID using reflection
            try {
                Object idValue = arg.getClass().getMethod("getId").invoke(arg);
                if (idValue != null) {
                    return idValue.toString();
                }
            } catch (Exception e) {
                // Ignore, will try other arguments
            }
        }

        // If no ID found, return null
        return null;
    }

    /**
     * Extract details using SpEL or by using method arguments
     */
    private String extractDetails(AuditableAction auditableAction, JoinPoint joinPoint, Object result) {
        try {
            if (!auditableAction.detailsExpression().isEmpty()) {
                return evaluateExpression(auditableAction.detailsExpression(), joinPoint, result);
            }

            // Use method arguments as details
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            String[] paramNames = signature.getParameterNames();
            Object[] args = joinPoint.getArgs();

            Map<String, Object> detailsMap = new HashMap<>();

            // Add arguments to details map
            for (int i = 0; i < args.length; i++) {
                if (args[i] != null) {
                    // Skip large objects or collections unless explicitly requested
                    if (args[i] instanceof byte[] || args[i] instanceof Iterable) {
                        continue;
                    }
                    detailsMap.put(paramNames[i], args[i]);
                }
            }

            // Add result to details if not null and not too complex
            if (result != null && !(result instanceof byte[] || result instanceof Iterable)) {
                detailsMap.put("result", result);
            }

            return objectMapper.writeValueAsString(detailsMap);
        } catch (JsonProcessingException e) {
            log.error("Error serializing details to JSON", e);
            return "{}";
        }
    }

    /**
     * Evaluate a SpEL expression using the join point and result
     */
    private String evaluateExpression(String expressionString, JoinPoint joinPoint, Object result) {
        try {
            StandardEvaluationContext context = new StandardEvaluationContext();

            // Add method arguments to context
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            String[] paramNames = signature.getParameterNames();
            Object[] args = joinPoint.getArgs();

            for (int i = 0; i < args.length; i++) {
                context.setVariable(paramNames[i], args[i]);
            }

            // Add result to context
            context.setVariable("result", result);

            // Evaluate expression
            Expression expression = expressionParser.parseExpression(expressionString);
            Object value = expression.getValue(context);

            return value != null ? value.toString() : null;
        } catch (Exception e) {
            log.error("Error evaluating expression: " + expressionString, e);
            return null;
        }
    }
}
