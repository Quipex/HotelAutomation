package com.hotel.backendservice.audit;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * ThreadLocal-based holder for audit context information.
 * Stores information about the current user/actor during request processing.
 */
@Slf4j
public class AuditContextHolder {
    private static final ThreadLocal<AuditContext> contextHolder = new ThreadLocal<>();

    /**
     * Set the current audit context
     * @param context The audit context to set
     */
    public static void setContext(AuditContext context) {
        contextHolder.set(context);
        log.debug("Set audit context: {}", context);
    }

    /**
     * Get the current audit context
     * @return The current audit context or null if not set
     */
    public static AuditContext getContext() {
        return contextHolder.get();
    }

    /**
     * Clear the current audit context
     */
    public static void clearContext() {
        contextHolder.remove();
        log.debug("Cleared audit context");
    }

    /**
     * Data class representing audit context information
     */
    @Data
    public static class AuditContext {
        private String platform;
        private String userId;
        private String userName;
        private String userNick;
        private String userAgent;
        private String ipAddress;
    }
} 