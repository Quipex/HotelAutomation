package com.hotel.backendservice.security.abac;

/**
 * Exception thrown when a requested policy cannot be found.
 */
public class PolicyNotFoundException extends RuntimeException {

    public PolicyNotFoundException(String message) {
        super(message);
    }

    public PolicyNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
