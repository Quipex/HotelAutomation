package com.hotel.backendv2.integration;

import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;
import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.Callable;

/**
 * Interceptor that applies Resilience4j retry semantics to RestTemplate calls
 * and logs each retry attempt, success, and final failure.
 */
public class Resilience4jRetryInterceptor implements ClientHttpRequestInterceptor {

    private static final Logger log = LoggerFactory.getLogger(Resilience4jRetryInterceptor.class);
    public final Retry retry;

    public Resilience4jRetryInterceptor(int maxAttempts, Duration backoffDelay, String retryName) {
        // Configure retry: maxAttempts retries with fixed wait duration
        RetryConfig config = RetryConfig.custom()
            .maxAttempts(maxAttempts)
            .waitDuration(backoffDelay)
            .retryExceptions(IOException.class)
            .build();

        this.retry = Retry.of(retryName, config);

        // Subscribe to retry events for debug logging
        this.retry.getEventPublisher()
            .onRetry(event -> log.debug(
                "[Resilience4j] Retry attempt #{} after {}  for '{}' due to {}",
                backoffDelay,
                event.getNumberOfRetryAttempts(),
                event.getName(),
                event.getLastThrowable() != null ? event.getLastThrowable().toString() : "<no exception>"
            ))
            .onSuccess(event -> log.debug(
                "[Resilience4j] Call succeeded on attempt #{} for '{}'",
                event.getNumberOfRetryAttempts(),
                event.getName()
            ))
            .onError(event -> log.error(
                "[Resilience4j] All {} attempts failed for '{}': {}",
                event.getNumberOfRetryAttempts(),
                event.getName(),
                event.getLastThrowable() != null ? event.getLastThrowable().toString() : "<no exception>"
            ));
    }

    @Override
    public ClientHttpResponse intercept(HttpRequest request,
                                        byte[] body,
                                        ClientHttpRequestExecution execution) throws IOException {
        log.debug("[Resilience4j] Preparing request to {}", request.getURI());

        Callable<ClientHttpResponse> decorated = Retry.decorateCallable(
            retry,
            () -> {
                ClientHttpResponse response = execution.execute(request, body);
                // If HTTP 5xx, trigger retry by throwing IOException
                if (response.getStatusCode().is5xxServerError()) {
                    response.close();
                    throw new IOException("Server error: " + response.getStatusCode());
                }
                return response;
            }
        );

        try {
            ClientHttpResponse successful = decorated.call();
            log.debug("[Resilience4j] Received {} from {}", successful.getStatusCode(), request.getURI());
            return successful;
        } catch (Exception ex) {
            // After all retries exhausted, log and rethrow
            Throwable cause = ex.getCause() != null ? ex.getCause() : ex;
            log.error("[Resilience4j] Exhausted {} attempts for {}", retry.getRetryConfig().getMaxAttempts(), request.getURI(), cause);
            if (cause instanceof IOException) {
                throw (IOException) cause;
            }
            throw new IOException(cause);
        }
    }
}
