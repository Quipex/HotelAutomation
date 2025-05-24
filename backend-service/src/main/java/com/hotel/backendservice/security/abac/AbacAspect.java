package com.hotel.backendservice.security.abac;

import com.hotel.backendservice.audit.AuditContextHolder;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.annotation.Order;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

/**
 * Aspect that enforces Attribute-based Access Control on methods annotated with
 * {@link CheckPermission}.
 */
@Aspect
@Component
@Slf4j
@Order(1) // Ensure this runs before audit aspects
public class AbacAspect {

    private final PolicyService policyService;
    private final ExpressionParser expressionParser;

    /**
     * Default constructor for testing purposes
     */
    public AbacAspect() {
        this.policyService = null;
        this.expressionParser = new SpelExpressionParser();
    }

    /**
     * Main constructor used by Spring
     */
    public AbacAspect(PolicyService policyService) {
        this.policyService = policyService;
        this.expressionParser = new SpelExpressionParser();
    }

    /**
     * Checks if the current user has permission to execute the method.
     *
     * @param joinPoint The join point for the intercepted method
     * @throws AccessDeniedException if the user doesn't have permission
     */
    @Before("@annotation(com.hotel.backendservice.security.abac.CheckPermission)")
    public void checkPermission(JoinPoint joinPoint) {
        if (policyService == null) {
            log.warn("AbacAspect not properly initialized for method {}",
                ((MethodSignature) joinPoint.getSignature()).getMethod().getName());
            return;
        }

        // Get the audit context which contains user information
        AuditContextHolder.AuditContext context = AuditContextHolder.getContext();

        // Get method information
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        CheckPermission checkPermission = methodSignature.getMethod().getAnnotation(CheckPermission.class);

        // Get the policy to enforce
        String policyName = checkPermission.value();
        Expression policyExpression = policyService.getPolicy(policyName);
        if (policyExpression == null) {
            throw new PolicyNotFoundException("Policy not found: " + policyName);
        }

        // Create evaluation context with user attributes and method parameters
        StandardEvaluationContext evaluationContext = createEvaluationContext(context, joinPoint, methodSignature);

        // Evaluate the policy expression
        Boolean hasPermission = policyExpression.getValue(evaluationContext, Boolean.class);

        if (hasPermission == null || !hasPermission) {
            log.warn(
                "Access denied for policy '{}' when method '{}' called by user '{}'",
                policyName,
                methodSignature.getMethod().getName(),
                context.getUserId()
            );
            throw new AccessDeniedException(
                "Access denied for policy '" + policyName + "' when method '" +
                    methodSignature.getMethod().getName() + "' called by user '" +
                    context.getUserId() + "'"
            );
        }
    }

    /**
     * Create an evaluation context with user attributes from audit context
     *
     * @param auditContext The audit context
     * @param joinPoint    The join point
     * @return The evaluation context
     */
    private StandardEvaluationContext createEvaluationContext(
        AuditContextHolder.AuditContext auditContext,
        JoinPoint joinPoint,
        MethodSignature methodSignature) {
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
        String[] paramNames = methodSignature.getParameterNames();
        Object[] args = joinPoint.getArgs();

        for (int i = 0; i < args.length; i++) {
            context.setVariable(paramNames[i], args[i]);
        }

        return context;
    }
}
