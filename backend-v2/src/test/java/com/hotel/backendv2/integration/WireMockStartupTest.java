package com.hotel.backendv2.integration;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.hotel.backendv2.config.AbstractIntegrationTest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class WireMockStartupTest extends AbstractIntegrationTest {

    private WireMockServer wireMockServer;
    private RestTemplate restTemplate;
    private final int PORT = 8089;

    @BeforeEach
    public void setup() {
        wireMockServer = new WireMockServer(PORT);
        wireMockServer.start();
        WireMock.configureFor("localhost", PORT);
        restTemplate = new RestTemplate();
    }

    @AfterEach
    public void tearDown() {
        wireMockServer.stop();
    }

    @Test
    public void testWireMockIsRunning() {
        // Настраиваем мок для простого GET запроса
        stubFor(get(urlEqualTo("/test"))
                .willReturn(aResponse()
                        .withStatus(HttpStatus.OK.value())
                        .withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                        .withBody("{\"message\":\"WireMock is running!\"}")));

        // Выполняем запрос к моку
        String response = restTemplate.getForObject("http://localhost:" + PORT + "/test", String.class);

        // Проверяем, что получили ожидаемый ответ
        assertEquals("{\"message\":\"WireMock is running!\"}", response);

        // Проверяем, что запрос был выполнен
        verify(getRequestedFor(urlEqualTo("/test")));
    }
}
