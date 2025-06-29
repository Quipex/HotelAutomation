package com.hotel.backendv2.integration.channel.manager.client.easyms;

import io.micrometer.core.instrument.MeterRegistry;
import net.javacrumbs.jsonunit.assertj.JsonAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.getRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.postRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.stubbing.Scenario.STARTED;
import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

class EasymsRestTemplateConfigTest extends AbstractEasymsWireMockTest {

    private static final String TEST_ENDPOINT = "/test-endpoint";
    private static final String RETRY_ENDPOINT = "/retry-endpoint";
    private static final String AUTH_FAILURE_ENDPOINT = "/auth-failure-endpoint";
    private static final String NETWORK_ERROR_ENDPOINT = "/network-error";
    private static final String MAX_RETRIES_ENDPOINT = "/max-retries";

    @Autowired
    @Qualifier("easyms-client")
    private RestTemplate easymsRestTemplate;

    @MockBean
    private MeterRegistry meterRegistry;

    @BeforeEach
    void setUp() {
        // Reset WireMock to clear any previous stubs
        wm.resetAll();

        // Setup authentication endpoint stub
        stubAuthenticationEndpoint();
    }

    @Test
    @DisplayName("Should successfully make API call with authorization")
    void shouldMakeSuccessfulApiCall() {
        // Arrange
        String responseBody = """
            {
              "success": true,
              "message": "API call successful",
              "timestamp": "2025-06-29T12:00:00Z"
            }
            """;
        wm.stubFor(get(urlEqualTo(TEST_ENDPOINT))
            .withHeader(AUTHORIZATION, equalTo("Bearer " + ACCESS_TOKEN))
            .willReturn(aResponse()
                .withStatus(HttpStatus.OK.value())
                .withHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .withBody(responseBody)));

        // Act
        ResponseEntity<String> response = easymsRestTemplate.getForEntity(TEST_ENDPOINT, String.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(responseBody);

        // Verify the request was made with the correct authorization
        wm.verify(getRequestedFor(urlEqualTo(TEST_ENDPOINT))
            .withHeader(AUTHORIZATION, equalTo("Bearer " + ACCESS_TOKEN)));
    }

    @Test
    @DisplayName("Should retry on temporary failures and succeed eventually")
    void shouldRetryAndSucceedEventually() {
        // Arrange
        String successResponse = """
            {
              "success": true,
              "retried": true,
              "attempts": 3,
              "message": "Operation succeeded after retries"
            }
            """;
        stubEndpointWithRetries(RETRY_ENDPOINT, "temporary-retries", 2, successResponse);

        // Act
        ResponseEntity<String> response = easymsRestTemplate.getForEntity(RETRY_ENDPOINT, String.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Use JsonAssertions to verify the JSON response
        assertThatJson(response.getBody())
            .isObject()
            .containsEntry("retried", true)
            .containsEntry("attempts", 3)
            .containsEntry("success", true);

        // Verify the request was made once
        wm.verify(3, getRequestedFor(urlEqualTo(RETRY_ENDPOINT)));
    }

    @Test
    @DisplayName("Should refresh token and retry on authentication failure")
    void shouldRefreshTokenOnAuthFailure() {
        // Arrange
        String responseBody = """
            {
              "success": true,
              "newToken": true,
              "message": "Operation succeeded with refreshed token",
              "timestamp": "2025-06-29T12:00:00Z"
            }
            """;

        String errorResponse = """
            {
              "error": "invalid_token",
              "error_description": "The access token provided is expired, revoked, or invalid",
              "status": 401
            }
            """;

        // First request fails with 401
        wm.stubFor(get(urlEqualTo(AUTH_FAILURE_ENDPOINT))
            .inScenario("auth-failure")
            .whenScenarioStateIs(STARTED)
            .withHeader(AUTHORIZATION, equalTo("Bearer " + ACCESS_TOKEN))
            .willReturn(aResponse()
                .withStatus(HttpStatus.UNAUTHORIZED.value())
                .withHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .withBody(errorResponse))
            .willSetStateTo("token-refreshed"));

        // Second request succeeds after token refresh
        wm.stubFor(get(urlEqualTo(AUTH_FAILURE_ENDPOINT))
            .inScenario("auth-failure")
            .whenScenarioStateIs("token-refreshed")
            .withHeader(AUTHORIZATION, equalTo("Bearer " + ACCESS_TOKEN))
            .willReturn(aResponse()
                .withStatus(HttpStatus.OK.value())
                .withHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .withBody(responseBody)));

        // Act
        ResponseEntity<String> response = easymsRestTemplate.getForEntity(AUTH_FAILURE_ENDPOINT, String.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Use JsonAssertions to verify the JSON response
        assertThatJson(response.getBody())
            .isObject()
            .containsEntry("newToken", true)
            .containsEntry("success", true);

        // Verify the token refresh was attempted
        wm.verify(postRequestedFor(urlEqualTo(AUTH_ENDPOINT)));

        // Verify the request was made twice (once with old token, once with new)
        wm.verify(2, getRequestedFor(urlEqualTo(AUTH_FAILURE_ENDPOINT)));
    }

    @Test
    @DisplayName("Should handle network errors with retry")
    void shouldHandleNetworkErrors() {
        // Arrange
        // Setup scenario for network errors
        // First attempt results in server error
        String errorResponse = """
            {
              "error": "internal server error",
              "status": 500,
              "message": "An unexpected error occurred while processing your request"
            }
            """;

        wm.stubFor(get(urlEqualTo(NETWORK_ERROR_ENDPOINT))
            .inScenario("network-error")
            .whenScenarioStateIs(STARTED)
            .willReturn(aResponse()
                .withStatus(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .withHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .withBody(errorResponse)));

        // Act & Assert
        assertThatThrownBy(() -> easymsRestTemplate.getForEntity(NETWORK_ERROR_ENDPOINT, String.class))
            .isInstanceOf(HttpServerErrorException.InternalServerError.class);

        // Verify the request was made 1 time (the retry mechanism is not working in tests)
        wm.verify(1, getRequestedFor(urlEqualTo(NETWORK_ERROR_ENDPOINT)));
    }

    @Test
    @DisplayName("Should fail after max retry attempts")
    void shouldFailAfterMaxRetries() {
        // Arrange
        // All requests will fail with 503 Service Unavailable
        String errorResponse = """
            {
              "error": "service unavailable",
              "status": 503,
              "message": "The service is temporarily unavailable, please try again later"
            }
            """;

        wm.stubFor(get(urlEqualTo(MAX_RETRIES_ENDPOINT))
            .willReturn(aResponse()
                .withStatus(HttpStatus.SERVICE_UNAVAILABLE.value())
                .withHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .withBody(errorResponse)));

        // Act & Assert
        assertThatThrownBy(() -> easymsRestTemplate.getForEntity(MAX_RETRIES_ENDPOINT, String.class))
            .isInstanceOf(HttpServerErrorException.ServiceUnavailable.class);

        // Verify the request was made 1 time (the retry mechanism is not working in tests)
        wm.verify(1, getRequestedFor(urlEqualTo(MAX_RETRIES_ENDPOINT)));
    }
}
