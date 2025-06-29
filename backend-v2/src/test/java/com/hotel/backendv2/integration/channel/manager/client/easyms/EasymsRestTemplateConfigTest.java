package com.hotel.backendv2.integration.channel.manager.client.easyms;

import com.github.tomakehurst.wiremock.http.Fault;
import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.containing;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.getRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.postRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.stubbing.Scenario.STARTED;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

class EasymsRestTemplateConfigTest extends AbstractEasymsWireMockTest {

    private static final String TEST_ENDPOINT = "/test-endpoint";
    private static final String RETRY_ENDPOINT = "/retry-endpoint";
    private static final String AUTH_FAILURE_ENDPOINT = "/auth-failure-endpoint";

    @Autowired
    @Qualifier("easyms-client")
    private RestTemplate easymsRestTemplate;

    @SpyBean
    private MeterRegistry meterRegistry;

    @Test
    @DisplayName("Should successfully make API call with authorization")
    void shouldMakeSuccessfulApiCall() {
        // Arrange
        String responseBody = "{\"success\":true}";
        wm.stubFor(get(urlEqualTo(TEST_ENDPOINT))
            .withHeader(AUTHORIZATION, equalTo("Bearer " + ACCESS_TOKEN))
            .willReturn(aResponse()
                .withStatus(HttpStatus.OK.value())
                .withHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .withBody(responseBody)));

        // Act
        ResponseEntity<String> response = easymsRestTemplate.getForEntity(TEST_ENDPOINT, String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(responseBody, response.getBody());
        verify(meterRegistry).counter("easyms.call.success");

        // Verify the request was made with the correct authorization
        wm.verify(getRequestedFor(urlEqualTo(TEST_ENDPOINT))
            .withHeader(AUTHORIZATION, equalTo("Bearer " + ACCESS_TOKEN)));
    }

    @Test
    @DisplayName("Should retry on temporary failures and succeed eventually")
    void shouldRetryAndSucceedEventually() {
        // Arrange
        String successResponse = "{\"success\":true,\"retried\":true}";
        stubEndpointWithRetries(RETRY_ENDPOINT, "retry-scenario", 2, successResponse);

        // Act
        ResponseEntity<String> response = easymsRestTemplate.getForEntity(RETRY_ENDPOINT, String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(successResponse, response.getBody());

        // Verify metrics
        verify(meterRegistry, times(2)).counter("easyms.retry.count");
        verify(meterRegistry).counter("easyms.call.success");

        // Verify the request was made multiple times
        wm.verify(3, getRequestedFor(urlEqualTo(RETRY_ENDPOINT)));
    }

    @Test
    @DisplayName("Should refresh token and retry on authentication failure")
    void shouldRefreshTokenOnAuthFailure() {
        // Arrange
        String responseBody = "{\"success\":true,\"newToken\":true}";

        // First request fails with 401
        wm.stubFor(get(urlEqualTo(AUTH_FAILURE_ENDPOINT))
            .inScenario("auth-failure")
            .whenScenarioStateIs(STARTED)
            .withHeader(AUTHORIZATION, containing(ACCESS_TOKEN))
            .willReturn(aResponse()
                .withStatus(HttpStatus.UNAUTHORIZED.value())
                .withHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .withBody("{\"error\":\"invalid_token\"}"))
            .willSetStateTo("token-refreshed"));

        // Second request succeeds after token refresh
        wm.stubFor(get(urlEqualTo(AUTH_FAILURE_ENDPOINT))
            .inScenario("auth-failure")
            .whenScenarioStateIs("token-refreshed")
            .withHeader(AUTHORIZATION, containing(ACCESS_TOKEN))
            .willReturn(aResponse()
                .withStatus(HttpStatus.OK.value())
                .withHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .withBody(responseBody)));

        // Act
        ResponseEntity<String> response = easymsRestTemplate.getForEntity(AUTH_FAILURE_ENDPOINT, String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(responseBody, response.getBody());

        // Verify the token refresh was attempted
        wm.verify(postRequestedFor(urlEqualTo(AUTH_ENDPOINT)));

        // Verify the request was made twice (once with old token, once with new)
        wm.verify(2, getRequestedFor(urlEqualTo(AUTH_FAILURE_ENDPOINT)));
    }

    @Test
    @DisplayName("Should handle network errors with retry")
    void shouldHandleNetworkErrors() {
        // Arrange
        String endpointUrl = "/network-error";

        // First two requests will fail with connection reset
        wm.stubFor(get(urlEqualTo(endpointUrl))
            .inScenario("network-error")
            .whenScenarioStateIs(STARTED)
            .willReturn(aResponse().withFault(Fault.CONNECTION_RESET_BY_PEER))
            .willSetStateTo("error-1"));

        wm.stubFor(get(urlEqualTo(endpointUrl))
            .inScenario("network-error")
            .whenScenarioStateIs("error-1")
            .willReturn(aResponse().withFault(Fault.CONNECTION_RESET_BY_PEER))
            .willSetStateTo("success"));

        // Third request succeeds
        String successResponse = "{\"success\":true,\"afterNetworkError\":true}";
        wm.stubFor(get(urlEqualTo(endpointUrl))
            .inScenario("network-error")
            .whenScenarioStateIs("success")
            .willReturn(aResponse()
                .withStatus(HttpStatus.OK.value())
                .withHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .withBody(successResponse)));

        // Act
        ResponseEntity<String> response = easymsRestTemplate.getForEntity(endpointUrl, String.class);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(successResponse, response.getBody());

        // Verify metrics
        verify(meterRegistry, times(2)).counter("easyms.retry.count");
        verify(meterRegistry).counter("easyms.call.success");
    }

    @Test
    @DisplayName("Should fail after max retry attempts")
    void shouldFailAfterMaxRetries() {
        // Arrange
        String endpointUrl = "/max-retries";

        // All requests will fail with 503 Service Unavailable
        wm.stubFor(get(urlEqualTo(endpointUrl))
            .willReturn(aResponse()
                .withStatus(HttpStatus.SERVICE_UNAVAILABLE.value())
                .withHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .withBody("{\"error\":\"service unavailable\"}")));

        // Act & Assert
        Exception exception = assertThrows(Exception.class, () -> {
            easymsRestTemplate.getForEntity(endpointUrl, String.class);
        });

        // Verify the request was made the maximum number of times (1 original + 3 retries)
        wm.verify(4, getRequestedFor(urlEqualTo(endpointUrl)));

        // Verify metrics
        verify(meterRegistry, times(3)).counter("easyms.retry.count");
        verify(meterRegistry).counter("easyms.call.error");
    }
}
