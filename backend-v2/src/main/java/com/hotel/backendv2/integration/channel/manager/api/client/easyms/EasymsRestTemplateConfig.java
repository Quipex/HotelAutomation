package com.hotel.backendv2.integration.channel.manager.client.easyms;

import com.hotel.backendv2.integration.Resilience4jRetryInterceptor;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.List;

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
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout((int) connectTimeout.toMillis());
        requestFactory.setReadTimeout((int) readTimeout.toMillis());

        // 2. Базовый RestTemplate с authInterceptor
        RestTemplate restTemplate = new RestTemplateBuilder()
            .rootUri(baseUrl)
            .requestFactory(() -> requestFactory)
            .interceptors(List.of(authInterceptor))
            .build();

        // 3. Создаём и настраиваем наш retry-interceptor
        Resilience4jRetryInterceptor retryInterceptor =
            new Resilience4jRetryInterceptor(maxRetryAttempts, backoffDelay);

        // 4. Подписываемся на метрики
        retryInterceptor.getRetry().getEventPublisher()
            .onRetry(e -> meterRegistry.counter("easyms.retry.count").increment())
            .onSuccess(e -> meterRegistry.counter("easyms.call.success").increment())
            .onError(e -> meterRegistry.counter("easyms.call.error").increment());

        // 5. Добавляем interceptor **после** authInterceptor
        restTemplate.getInterceptors().add(retryInterceptor);

        // 6. Возвращаем готовый RestTemplate
        return restTemplate;
    }
}
