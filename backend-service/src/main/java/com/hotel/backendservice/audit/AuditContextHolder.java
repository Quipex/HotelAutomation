package com.hotel.backendservice.audit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Holds audit context information in a ThreadLocal.
 * This is used to link the audit trail to the current user and operation context.
 */
public class AuditContextHolder {
    private static final Logger log = LoggerFactory.getLogger(AuditContextHolder.class);
    private static final ThreadLocal<AuditContext> contextHolder = new ThreadLocal<>();

    /**
     * Set the current audit context.
     */
    public static void setContext(AuditContext context) {
        if (context == null) {
            throw new IllegalArgumentException("AuditContext cannot be null");
        }
        log.debug("Setting audit context: {}", context);
        contextHolder.set(context);
    }

    /**
     * Get the current audit context.
     *
     * @return the current audit context
     * @throws AuditContextMissingException if no context is set
     */
    public static AuditContext getContext() {
        AuditContext context = contextHolder.get();
        if (context == null) {
            throw new AuditContextMissingException("No audit context found for this request");
        }
        log.debug("Getting audit context: {}", context.getAttributes());
        return context;
    }

    /**
     * Check if an audit context exists for the current thread.
     */
    public static boolean hasContext() {
        return contextHolder.get() != null;
    }

    /**
     * Get the current audit context if it exists, or null if it doesn't.
     * This method does not throw an exception if no context is found.
     */
    public static AuditContext getContextOrNull() {
        AuditContext context = contextHolder.get();
        if (context != null) {
            log.debug("Getting audit context: {}", context.getAttributes());
        }
        return context;
    }

    /**
     * Clear the current audit context.
     */
    public static void clearContext() {
        log.debug("Clearing audit context");
        contextHolder.remove();
    }

    public static void setAttribute(String key, Object object) {
        getContext().addAttribute(key, object);
    }

    /**
     * Audit context class that holds information about the current user and request.
     */
    public static class AuditContext {
        private String userId;
        private String userName;
        private String userNick;
        private String role;
        private String platform;
        private String userAgent;
        private String ipAddress;
        private final Map<String, Object> attributes = new HashMap<>();

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
            attributes.put("userId", userId);
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
            attributes.put("userName", userName);
        }

        public String getUserNick() {
            return userNick;
        }

        public void setUserNick(String userNick) {
            this.userNick = userNick;
            attributes.put("userNick", userNick);
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
            attributes.put("role", role);
        }

        public String getPlatform() {
            return platform;
        }

        public void setPlatform(String platform) {
            this.platform = platform;
            attributes.put("platform", platform);
        }

        public String getUserAgent() {
            return userAgent;
        }

        public void setUserAgent(String userAgent) {
            this.userAgent = userAgent;
            attributes.put("userAgent", userAgent);
        }

        public String getIpAddress() {
            return ipAddress;
        }

        public void setIpAddress(String ipAddress) {
            this.ipAddress = ipAddress;
            attributes.put("ipAddress", ipAddress);
        }

        public Map<String, Object> getAttributes() {
            return attributes;
        }

        public void addAttribute(String key, Object value) {
            attributes.put(key, value);
        }

        @Override
        public String toString() {
            return "AuditContext{" +
                "userId='" + userId + '\'' +
                ", userName='" + userName + '\'' +
                ", role='" + role + '\'' +
                ", platform='" + platform + '\'' +
                ", attributes=" + attributes +
                '}';
        }
    }

    /**
     * Exception thrown when no audit context is found.
     */
    public static class AuditContextMissingException extends RuntimeException {
        public AuditContextMissingException(String message) {
            super(message);
        }
    }
}
