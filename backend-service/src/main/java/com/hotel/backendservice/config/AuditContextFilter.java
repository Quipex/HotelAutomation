package com.hotel.backendservice.config;

import com.hotel.backendservice.audit.AuditContextHolder;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter to set up audit context for web requests
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class AuditContextFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
        try {
            setupAuditContext(request);
            filterChain.doFilter(request, response);
        } finally {
            AuditContextHolder.clearContext();
        }
    }

    /**
     * Set up audit context based on the HTTP request
     *
     * @param request The HTTP request
     */
    private void setupAuditContext(HttpServletRequest request) {
        // Extract user information from the request
        // In a real application, this would come from JWT token, session, etc.
        String userId = request.getHeader("X-User-ID");
        String userName = request.getHeader("X-User-Name");

        // Create and populate audit context
        AuditContextHolder.AuditContext context = new AuditContextHolder.AuditContext();
        context.setPlatform("web");
        context.setUserId(userId != null ? userId : "anonymous");
        context.setUserName(userName != null ? userName : "Anonymous User");
        context.setUserNick(request.getHeader("X-User-Nick"));
        context.setUserAgent(request.getHeader("User-Agent"));
        context.setIpAddress(getClientIp(request));

        AuditContextHolder.setContext(context);
        log.debug("Set up audit context for web request: {}", context);
    }

    /**
     * Get client IP address from request
     *
     * @param request The HTTP request
     * @return The client IP address
     */
    private String getClientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isEmpty()) {
            // X-Forwarded-For might contain multiple IPs (client, proxies...)
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
