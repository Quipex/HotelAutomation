package com.hotel.backendservice.config.abac;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark methods that require authorization check against an ABAC policy.
 * The policy name is specified as the annotation value.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface CheckPermission {
    /**
     * The name of the policy to check against.
     */
    String value();
} 