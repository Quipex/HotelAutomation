package com.hotel.backendv2.integration.channel.manager.api.client.easyms;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.assertj.core.api.ThrowableAssert.ThrowingCallable;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.ResourceAccessException;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

class EasymsRestTemplateConfigTest extends AbstractEasymsWireMockTest {

    private static final String TEST_ENDPOINT = "/test-endpoint";
    private static final String RETRY_ENDPOINT = "/retry-endpoint";
    private static final String AUTH_FAILURE_ENDPOINT = "/auth-failure-endpoint";

    @MockBean
    private MeterRegistry meterRegistry;

    @Mock
    private Counter retryCounter;

    @Mock
    private Counter retrySuccessCounter;

    @Mock
    private Counter callSuccessCounter;

    @Mock
    private Counter errorCounter;

    @Autowired
    private EasymsAuthenticationManager authenticationManager;

    @Autowired
    @Qualifier("easyms-client")
    private RestTemplate easymsRestTemplate;

    @BeforeEach
    void setUp() {
        // Reset WireMock to clear any previous stubs
        wm.resetAll();

        // Setup authentication endpoint stub
        stubAuthenticationEndpoint();

        authenticationManager.forceRefreshToken();

        clearInvocations(retryCounter, retrySuccessCounter, errorCounter, callSuccessCounter);

        when(meterRegistry.counter(eq("easyms.retry.count"))).thenReturn(retryCounter);
        when(meterRegistry.counter(eq("easyms.retry.success"))).thenReturn(retrySuccessCounter);
        when(meterRegistry.counter(eq("easyms.call.success"))).thenReturn(callSuccessCounter);
        when(meterRegistry.counter(eq("easyms.retry.error"))).thenReturn(errorCounter);
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
                .withStatus(OK.value())
                .withHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .withBody(responseBody)));

        // Act
        ResponseEntity<String> response = easymsRestTemplate.getForEntity(TEST_ENDPOINT, String.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(OK);
        assertThat(response.getBody()).isEqualTo(responseBody);

        wm.verify(1, postRequestedFor(urlEqualTo(AUTH_ENDPOINT)));
        wm.verify(1, getRequestedFor(urlEqualTo(TEST_ENDPOINT))
            .withHeader(AUTHORIZATION, equalTo("Bearer " + ACCESS_TOKEN)));

        // Verify metrics
        verify(callSuccessCounter, times(1)).increment();
        verifyNoInteractions(retryCounter, errorCounter, retrySuccessCounter);
    }

    @Test
    @DisplayName("Should retry on temporary failures and succeed eventually")
    void shouldRetryAndSucceedEventually() {
        // Arrange
        String successResponse = """
            {"success": true}
            """;
        stubEndpointWithRetries(RETRY_ENDPOINT, "temporary-retries", 2, successResponse);

        // Act
        ResponseEntity<String> response = easymsRestTemplate.getForEntity(RETRY_ENDPOINT, String.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(OK);

        // Use JsonAssertions to verify the JSON response
        assertThatJson(response.getBody())
            .isObject()
            .containsEntry("success", true);

        wm.verify(1, postRequestedFor(urlEqualTo(AUTH_ENDPOINT)));
        wm.verify(3, getRequestedFor(urlEqualTo(RETRY_ENDPOINT)));

        // Verify metrics - 2 retries и 1 success
        verify(retryCounter, times(2)).increment();
        verify(retrySuccessCounter, times(1)).increment();
        verifyNoInteractions(errorCounter, callSuccessCounter);
    }

    @Test
    @DisplayName("Should refresh token and retry on authentication failure")
    void shouldRefreshTokenOnAuthFailure() {
        // Arrange
        String successResponseBody = """
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
                .withStatus(UNAUTHORIZED.value())
                .withHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .withBody(errorResponse))
            .willSetStateTo("token-refreshed"));

        // Second request succeeds after token refresh
        wm.stubFor(get(urlEqualTo(AUTH_FAILURE_ENDPOINT))
            .inScenario("auth-failure")
            .whenScenarioStateIs("token-refreshed")
            .withHeader(AUTHORIZATION, equalTo("Bearer " + ACCESS_TOKEN))
            .willReturn(aResponse()
                .withStatus(OK.value())
                .withHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .withBody(successResponseBody)));

        // Act
        ResponseEntity<String> response = easymsRestTemplate.getForEntity(AUTH_FAILURE_ENDPOINT, String.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(OK);

        // Use JsonAssertions to verify the JSON response
        assertThatJson(response.getBody())
            .isObject()
            .containsEntry("newToken", true)
            .containsEntry("success", true);

        wm.verify(2, postRequestedFor(urlEqualTo(AUTH_ENDPOINT)));
        wm.verify(2, getRequestedFor(urlEqualTo(AUTH_FAILURE_ENDPOINT)));

        // todo: fixme должен быть саксесс каунтер
        verifyNoInteractions(retryCounter, errorCounter, callSuccessCounter, retrySuccessCounter);
    }

    @Test
    @DisplayName("Should fail after max retry attempts")
    void shouldFailAfterMaxRetries() {
        // Arrange
        String successResponse = """
            {"success": true}
            """;
        stubEndpointWithRetries(RETRY_ENDPOINT, "temporary-retries", 5, successResponse);

        // Act
        ThrowingCallable action = () -> easymsRestTemplate.getForEntity(RETRY_ENDPOINT, String.class);

        // Assert
        assertThatThrownBy(action)
            .isInstanceOf(ResourceAccessException.class)
            .hasMessageContaining("503");

        wm.verify(1, postRequestedFor(urlEqualTo(AUTH_ENDPOINT)));
        wm.verify(3, getRequestedFor(urlEqualTo(RETRY_ENDPOINT)));

        // Verify metrics - 2 retries и 1 error
        verify(retryCounter, times(2)).increment();
        verify(errorCounter, times(1)).increment();
        verifyNoInteractions(retrySuccessCounter, callSuccessCounter);
    }
}
