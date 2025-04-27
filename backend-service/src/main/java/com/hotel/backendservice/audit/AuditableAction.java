package com.hotel.backendservice.audit;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark methods that should be audited.
 * The audit aspect will intercept calls to methods annotated with this annotation
 * and record an audit entry.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuditableAction {
    /**
     * The action being performed (e.g., "create", "update", "delete")
     */
    String action();

    /**
     * The type of object being acted upon (e.g., "booking", "client", "room")
     */
    String objectType();

    /**
     * SPEL expression to extract the object ID from method arguments or return value
     * Default is empty, in which case the aspect will try to find an "id" field in the arguments
     */
    String objectIdExpression() default "";

    /**
     * SPEL expression to extract additional details to be stored as JSON
     * Default is empty, in which case the aspect will use the method arguments
     */
    String detailsExpression() default "";
}
