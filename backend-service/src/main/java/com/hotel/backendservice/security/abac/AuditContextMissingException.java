package com.hotel.backendservice.security.abac;

/**
 * Exception thrown when a required audit context is missing.
 */
public class AuditContextMissingException extends RuntimeException {

    public AuditContextMissingException(String message) {
        super(message);
    }

    public AuditContextMissingException(String message, Throwable cause) {
        super(message, cause);
    }
}
