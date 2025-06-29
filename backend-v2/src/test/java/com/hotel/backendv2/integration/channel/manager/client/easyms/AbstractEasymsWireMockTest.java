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

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static com.github.tomakehurst.wiremock.stubbing.Scenario.STARTED;

public abstract class AbstractEasymsWireMockTest extends AbstractIntegrationTest {

    protected static final int PORT = 8091;
    protected static final String AUTH_ENDPOINT = "/oauth/token";
    protected static final String BASIC_AUTH_USERNAME = "easyms";
    protected static final String BASIC_AUTH_PASSWORD = "secret";
    protected static final String TEST_USERNAME = "test-user";
    protected static final String TEST_PASSWORD = "test-password";
    protected static final String ACCESS_TOKEN = "test-access-token";
    protected static final String REFRESH_TOKEN = "test-refresh-token";

    @RegisterExtension
    static WireMockExtension wm = WireMockExtension.newInstance()
        .options(wireMockConfig().port(PORT))
        .build();

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
        Map<String, Object> authResponse = new HashMap<>();
        authResponse.put("access_token", ACCESS_TOKEN);
        authResponse.put("refresh_token", REFRESH_TOKEN);
        authResponse.put("expires_in", 3600);
        authResponse.put("token_type", "bearer");
        authResponse.put("scope", "read write");
        authResponse.put("jti", "test-jti");
        authResponse.put("expires_at", Instant.now().plusSeconds(3600).toString());

        try {
            String authResponseJson = objectMapper.writeValueAsString(authResponse);
            wm.stubFor(post(urlEqualTo(AUTH_ENDPOINT))
                    .willReturn(aResponse()
                            .withStatus(HttpStatus.OK.value())
                            .withHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                            .withBody(authResponseJson)));
        } catch (Exception e) {
            throw new RuntimeException("Failed to stub authentication endpoint", e);
        }
    }

    /**
     * Helper method to stub an endpoint with retries
     *
     * @param endpoint The endpoint path to stub
     * @param scenarioName The name of the scenario for state tracking
     * @param failureCount Number of times the endpoint should fail before succeeding
     * @param successResponse The response body to return on success
     */
    protected void stubEndpointWithRetries(String endpoint, String scenarioName, int failureCount, String successResponse) {
        // First request fails with 503 Service Unavailable
        wm.stubFor(get(urlEqualTo(endpoint))
                .inScenario(scenarioName)
                .whenScenarioStateIs(STARTED)
                .willReturn(aResponse()
                        .withStatus(HttpStatus.SERVICE_UNAVAILABLE.value())
                        .withHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .withBody("{\"error\":\"service unavailable\"}"))
                .willSetStateTo("failure-1"));

        // Setup intermediate failure states if needed
        for (int i = 1; i < failureCount; i++) {
            String currentState = "failure-" + i;
            String nextState = (i == failureCount - 1) ? "success" : "failure-" + (i + 1);

            wm.stubFor(get(urlEqualTo(endpoint))
                    .inScenario(scenarioName)
                    .whenScenarioStateIs(currentState)
                    .willReturn(aResponse()
                            .withStatus(HttpStatus.SERVICE_UNAVAILABLE.value())
                            .withHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                            .withBody("{\"error\":\"service unavailable\"}"))
                    .willSetStateTo(nextState));
        }

        // Final request succeeds
        wm.stubFor(get(urlEqualTo(endpoint))
                .inScenario(scenarioName)
                .whenScenarioStateIs("success")
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
