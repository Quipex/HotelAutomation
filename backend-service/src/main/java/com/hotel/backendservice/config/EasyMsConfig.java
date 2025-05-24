package com.hotel.backendservice.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * Configuration for EasyMS PMS client
 */
@Configuration
public class EasyMsConfig {

    @Bean
    public WebClient easyMsWebClient(@Value("${easyms.base-url}") String baseUrl,
                                     @Value("${easyms.timeouts.connect}") Duration connectTimeout,
                                     @Value("${easyms.timeouts.read}") Duration readTimeout) {
        return WebClient.builder()
            .baseUrl(baseUrl)
            .clientConnector(new ReactorClientHttpConnector(
                HttpClient.create()
                    .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, (int) connectTimeout.toMillis())
                    .doOnConnected(conn -> conn.addHandlerLast(new ReadTimeoutHandler(readTimeout.toMillis(), TimeUnit.MILLISECONDS)))))
            .build();
    }
}
