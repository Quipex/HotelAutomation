package com.hotel.backendv2.integration;

import com.github.tomakehurst.wiremock.junit5.WireMockExtension;
import com.hotel.backendv2.config.AbstractIntegrationTest;
import com.hotel.backendv2.config.NoopEasymsRestLogic;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.getRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static org.junit.jupiter.api.Assertions.assertEquals;

@Import(NoopEasymsRestLogic.class)
public class WireMockStartupTest extends AbstractIntegrationTest {

    private static final int PORT = 8089;

    @RegisterExtension
    static WireMockExtension wm = WireMockExtension.newInstance()
        .options(wireMockConfig().port(PORT))
        .build();

    @Test
    public void testWireMockIsRunning() {
        // Setup mock for a simple GET request
        wm.stubFor(get(urlEqualTo("/test"))
            .willReturn(aResponse()
                .withStatus(HttpStatus.OK.value())
                .withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .withBody("{\"message\":\"WireMock is running!\"}")));

        // Execute request to the mock
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject("http://localhost:" + PORT + "/test", String.class);

        // Verify we got the expected response
        assertEquals("{\"message\":\"WireMock is running!\"}", response);

        // Verify the request was made
        wm.verify(getRequestedFor(urlEqualTo("/test")));
    }
}
