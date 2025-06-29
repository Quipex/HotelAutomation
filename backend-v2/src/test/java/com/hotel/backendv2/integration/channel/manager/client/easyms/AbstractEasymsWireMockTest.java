package com.hotel.backendv2.integration.channel.manager.client.easyms;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.tomakehurst.wiremock.http.Fault;
import com.github.tomakehurst.wiremock.junit5.WireMockExtension;
import com.hotel.backendv2.config.AbstractIntegrationTest;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.containing;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;

public abstract class AbstractEasymsWireMockTest extends AbstractIntegrationTest {

    @RegisterExtension
    static WireMockExtension wm = WireMockExtension.newInstance()
        .options(wireMockConfig().dynamicPort())
        .build();

    protected static final int PORT = 8091;
    protected static final String AUTH_ENDPOINT = "/oauth/token";
    protected static final String BASIC_AUTH_USERNAME = "easyms";
    protected static final String BASIC_AUTH_PASSWORD = "secret";
    protected static final String TEST_USERNAME = "test-user";
    protected static final String TEST_PASSWORD = "test-password";
    protected static final String ACCESS_TOKEN = "test-access-token";
    protected static final String REFRESH_TOKEN = "test-refresh-token";

    @Autowired
    protected ObjectMapper objectMapper;

    /**
     * Configure Spring properties to use WireMock server
     */
    @DynamicPropertySource
    static void configureEasymsProperties(DynamicPropertyRegistry registry) {
        registry.add("easyms.base-url", () -> "http://localhost:" + PORT);
        registry.add("easyms.auth.token-url", () -> "http://localhost:" + PORT + AUTH_ENDPOINT);
        registry.add("easyms.auth.login", () -> TEST_USERNAME);
        registry.add("easyms.auth.password", () -> TEST_PASSWORD);
        registry.add("easyms.auth.basic-auth.username", () -> BASIC_AUTH_USERNAME);
        registry.add("easyms.auth.basic-auth.password", () -> BASIC_AUTH_PASSWORD);
    }

    /**
     * Set up default authentication endpoint stub
     */
    protected void stubAuthenticationEndpoint() {
        // Create authentication response
        Map<String, Object> authResponse = new HashMap<>();
        authResponse.put("access_token", ACCESS_TOKEN);
        authResponse.put("token_type", "bearer");
        authResponse.put("refresh_token", REFRESH_TOKEN);
        authResponse.put("expires_in", 3600);
        authResponse.put("scope", "read write");
        authResponse.put("jti", UUID.randomUUID().toString());

        try {
            // Create basic auth header value
            String credentials = BASIC_AUTH_USERNAME + ":" + BASIC_AUTH_PASSWORD;
            String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());
            String expectedAuthHeader = "Basic " + encodedCredentials;

            // Stub the auth endpoint
            wm.stubFor(post(urlEqualTo(AUTH_ENDPOINT))
                .withHeader(HttpHeaders.AUTHORIZATION, equalTo(expectedAuthHeader))
                .withRequestBody(containing("username=" + TEST_USERNAME))
                .withRequestBody(containing("password=" + TEST_PASSWORD))
                .withRequestBody(containing("grant_type=password"))
                .willReturn(aResponse()
                    .withStatus(HttpStatus.OK.value())
                    .withHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .withBody(objectMapper.writeValueAsString(authResponse))));
        } catch (Exception e) {
            throw new RuntimeException("Failed to stub authentication endpoint", e);
        }
    }

    /**
     * Configure a scenario with retries
     *
     * @param endpointUrl     The endpoint URL to stub
     * @param scenarioName    The name of the scenario
     * @param failureCount    Number of times the endpoint should fail before succeeding
     * @param successResponse The response body to return on success
     */
    protected void stubEndpointWithRetries(String endpointUrl, String scenarioName, int failureCount,
                                           String successResponse) {
        // Initial state
        String initialState = "Started";
        String currentState = initialState;

        // Create failure states
        for (int i = 0; i < failureCount; i++) {
            String nextState = "Failure-" + (i + 1);

            wm.stubFor(get(urlEqualTo(endpointUrl))
                .inScenario(scenarioName)
                .whenScenarioStateIs(currentState)
                .willReturn(aResponse()
                    .withStatus(HttpStatus.SERVICE_UNAVAILABLE.value())
                    .withFixedDelay(500)) // Add delay to simulate slow response
                .willSetStateTo(nextState));

            currentState = nextState;
        }

        // Final success state
        wm.stubFor(get(urlEqualTo(endpointUrl))
            .inScenario(scenarioName)
            .whenScenarioStateIs(currentState)
            .willReturn(aResponse()
                .withStatus(HttpStatus.OK.value())
                .withHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .withBody(successResponse)));
    }

    /**
     * Stub an endpoint to simulate network issues
     */
    protected void stubEndpointWithNetworkIssue(String endpointUrl, Fault fault) {
        wm.stubFor(get(urlEqualTo(endpointUrl))
            .willReturn(aResponse()
                .withFault(fault)));
    }

    /**
     * Stub an endpoint to simulate authentication failure
     */
    protected void stubEndpointWithAuthFailure(String endpointUrl) {
        wm.stubFor(get(urlEqualTo(endpointUrl))
            .willReturn(aResponse()
                .withStatus(HttpStatus.UNAUTHORIZED.value())
                .withHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .withBody("{\"error\":\"unauthorized\",\"error_description\":\"Invalid token\"}")));
    }

    /**
     * Test configuration to override beans for testing
     */
    @TestConfiguration
    static class EasymsTestConfig {
        @Bean
        @Primary
        public ObjectMapper objectMapper() {
            return new ObjectMapper();
        }
    }
}
