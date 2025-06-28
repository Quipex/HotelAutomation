package com.hotel.backendv2.integration.channel.manager.client.easyms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.support.HttpRequestWrapper;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class EasymsBearerAuthInterceptor implements ClientHttpRequestInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(EasymsBearerAuthInterceptor.class);
    
    private final EasymsAuthenticationManager authManager;
    
    public EasymsBearerAuthInterceptor(EasymsAuthenticationManager authManager) {
        this.authManager = authManager;
    }

    @Override
    @NonNull
    public ClientHttpResponse intercept(
        @NonNull HttpRequest request,
        @NonNull byte[] body,
        ClientHttpRequestExecution execution
    ) throws IOException {
        // Add the Bearer token to the request
        applyBearerToken(request);

        // Execute the request
        ClientHttpResponse response = execution.execute(request, body);

        // Check for auth errors (401 Unauthorized, 403 Forbidden)
        int statusCode = response.getStatusCode().value();
        if (statusCode == 401 || statusCode == 403) {
            logger.debug("Received {} status code from EasyMS API, refreshing token and retrying", statusCode);

            // Force token refresh
            authManager.forceRefreshToken();

            // Create a new request since the original one can't be reused
            HttpRequest newRequest = new HttpRequestWrapper(request);
            applyBearerToken(newRequest);

            // Return the new response
            return execution.execute(newRequest, body);
        }

        return response;
    }

    private void applyBearerToken(HttpRequest request) {
        String token = authManager.getAccessToken();
        if (token != null && !token.isEmpty()) {
            request.getHeaders().setBearerAuth(token);
        }
    }
}
