package com.hotel.backendv2.integration.channel.manager.api.client.easyms;

import com.hotel.backendv2.integration.Resilience4jRetryInterceptor;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Objects;

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
        Objects.requireNonNull(meterRegistry);

        var requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout((int) connectTimeout.toMillis());
        requestFactory.setReadTimeout((int) readTimeout.toMillis());

        var retryInterceptor =
            new Resilience4jRetryInterceptor(maxRetryAttempts, backoffDelay, "easyms");

        ClientHttpRequestInterceptor successInterceptor = (request, body, execution) -> {
            ClientHttpResponse response = execution.execute(request, body);
            if (response.getStatusCode().is2xxSuccessful()) {
                meterRegistry.counter("easyms.call.success").increment();
            }
            return response;
        };

        retryInterceptor.retry.getEventPublisher()
            .onRetry(e -> meterRegistry.counter("easyms.retry.count").increment())
            .onSuccess(e -> meterRegistry.counter("easyms.retry.success").increment())
            .onError(e -> meterRegistry.counter("easyms.retry.error").increment());

        return new RestTemplateBuilder()
            .rootUri(baseUrl)
            .requestFactory(() -> requestFactory)
            .interceptors(authInterceptor, retryInterceptor, successInterceptor)
            .build();
    }
}
