package com.hotel.backendservice.config.abac;

import com.hotel.backendservice.audit.AuditContextHolder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

/**
 * Aspect that enforces ABAC policies on methods annotated with @CheckPermission
 */
@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class AbacAspect {

    private final PolicyService policyService;

    /**
     * Enforce ABAC policies before executing methods annotated with @CheckPermission
     * @param joinPoint The join point
     * @throws AccessDeniedException If the user does not have permission
     */
    @Before("@annotation(com.hotel.backendservice.config.abac.CheckPermission)")
    public void checkPermission(JoinPoint joinPoint) {
        // Get the method signature
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        
        // Get the policy name from the annotation
        CheckPermission annotation = method.getAnnotation(CheckPermission.class);
        String policyName = annotation.value();
        
        // Get the policy expression
        Expression policyExpression = policyService.getPolicy(policyName);
        if (policyExpression == null) {
            log.error("Policy not found: {}", policyName);
            throw new AccessDeniedException("Policy not found: " + policyName);
        }
        
        // Get the current audit context
        AuditContextHolder.AuditContext auditContext = AuditContextHolder.getContext();
        if (auditContext == null) {
            log.error("No audit context found for method {}", method.getName());
            throw new AccessDeniedException("No audit context available");
        }
        
        // Create evaluation context with user attributes from audit context
        EvaluationContext context = createEvaluationContext(auditContext, joinPoint);
        
        // Evaluate the policy
        Boolean allowed = policyExpression.getValue(context, Boolean.class);
        if (allowed == null || !allowed) {
            log.warn("Access denied: policy={}, method={}, user={}", 
                    policyName, method.getName(), auditContext.getUserId());
            throw new AccessDeniedException("Access denied by policy: " + policyName);
        }
        
        log.debug("Access granted: policy={}, method={}, user={}", 
                policyName, method.getName(), auditContext.getUserId());
    }
    
    /**
     * Create an evaluation context with user attributes from audit context
     * @param auditContext The audit context
     * @param joinPoint The join point
     * @return The evaluation context
     */
    private EvaluationContext createEvaluationContext(
            AuditContextHolder.AuditContext auditContext, 
            JoinPoint joinPoint) {
        StandardEvaluationContext context = new StandardEvaluationContext();
        
        // Add user attributes from audit context
        context.setVariable("platform", auditContext.getPlatform());
        context.setVariable("userId", auditContext.getUserId());
        context.setVariable("userName", auditContext.getUserName());
        context.setVariable("userNick", auditContext.getUserNick());
        
        // TODO: In a real system, you would likely have a UserService to get roles
        // Add user roles (this is just an example)
        if ("telegram".equals(auditContext.getPlatform()) && 
                "admin_chat_id".equals(auditContext.getUserId())) {
            context.setVariable("role", "admin");
        } else if ("telegram".equals(auditContext.getPlatform()) && 
                "manager_chat_id".equals(auditContext.getUserId())) {
            context.setVariable("role", "manager");
        } else {
            context.setVariable("role", "user");
        }
        
        // Add method arguments
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String[] paramNames = signature.getParameterNames();
        Object[] args = joinPoint.getArgs();
        
        for (int i = 0; i < args.length; i++) {
            context.setVariable(paramNames[i], args[i]);
        }
        
        return context;
    }
} 