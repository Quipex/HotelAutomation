package com.hotel.backendv2.integration.channel.manager.client.easyms;

import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.retry.RetryRegistry;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.List;
import java.util.function.Supplier;

@Configuration
public class EasymsRestTemplateConfig {

    @Value("${easyms.base-url}")
    private String baseUrl;

    @Value("${easyms.timeouts.connect}")
    private Duration connectTimeout;

    @Value("${easyms.timeouts.read}")
    private Duration readTimeout;

    @Value("${easyms.retry.max-attempts}")
    private int maxRetryAttempts;

    @Value("${easyms.retry.backoff-delay}")
    private Duration backoffDelay;

    private final EasymsBearerAuthInterceptor authInterceptor;

    public EasymsRestTemplateConfig(EasymsBearerAuthInterceptor authInterceptor) {
        this.authInterceptor = authInterceptor;
    }

    @Bean("easyms-client")
    public RestTemplate easyMsRestTemplate(MeterRegistry meterRegistry) {
        // Create request factory with timeouts
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout((int) connectTimeout.toMillis());
        requestFactory.setReadTimeout((int) readTimeout.toMillis());

        // Create RestTemplate with root URI
        RestTemplate restTemplate = new RestTemplateBuilder()
                .rootUri(baseUrl)
                .requestFactory(() -> requestFactory)
                .interceptors(List.of(authInterceptor))
                .build();

        // Configure retry
        RetryConfig retryConfig = RetryConfig.custom()
                .maxAttempts(maxRetryAttempts)
                .waitDuration(backoffDelay)
                .build();

        RetryRegistry retryRegistry = RetryRegistry.of(retryConfig);
        Retry retry = retryRegistry.retry("easyMsRetry");

        // Monitoring
        retry.getEventPublisher()
                .onRetry(event -> meterRegistry.counter("easyms.retry.count").increment())
                .onSuccess(event -> meterRegistry.counter("easyms.call.success").increment())
                .onError(event -> meterRegistry.counter("easyms.call.error").increment());

        // Wrap the RestTemplate with retry functionality
        Supplier<RestTemplate> retryableRestTemplateSupplier = Retry.decorateSupplier(retry, () -> restTemplate);

        // Return the decorated RestTemplate
        return retryableRestTemplateSupplier.get();
    }
}
