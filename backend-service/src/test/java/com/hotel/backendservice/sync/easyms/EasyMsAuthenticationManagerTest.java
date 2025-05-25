package com.hotel.backendservice.sync.easyms;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class EasyMsAuthenticationManagerTest {

    @InjectMocks
    private EasyMsAuthenticationManager authManager;

    @Mock
    private RestTemplate plainRestTemplate;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);

        // Set required properties manually
        ReflectionTestUtils.setField(authManager, "username", "test-user");
        ReflectionTestUtils.setField(authManager, "password", "test-password");
        ReflectionTestUtils.setField(authManager, "tokenUrl", "https://test.easyms.co/oauth/token");
        ReflectionTestUtils.setField(authManager, "tokenRefreshThresholdSeconds", 300);
        ReflectionTestUtils.setField(authManager, "plainRestTemplate", plainRestTemplate);
    }

    @Test
    void getAccessToken_shouldReturnTokenFromCache() throws Exception {
        // Given
        var mockResponse = createMockTokenResponse();
        var responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);

        when(plainRestTemplate.postForEntity(
                anyString(), any(HttpEntity.class), eq(EasyMsAuthenticationManager.TokenResponse.class)))
                .thenReturn(responseEntity);

        // When
        authManager.init(); // This should populate the token cache
        var accessToken = authManager.getAccessToken();

        // Then
        assertEquals("test-access-token", accessToken);
        verify(plainRestTemplate, times(1)).postForEntity(
                anyString(), any(HttpEntity.class), eq(EasyMsAuthenticationManager.TokenResponse.class));
    }

    @Test
    void getAccessToken_whenTokenExpired_shouldRefreshToken() throws Exception {
        // Given
        // First set up a successful response for the refresh call
        var mockResponse = createMockTokenResponse();
        var responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);

        when(plainRestTemplate.postForEntity(
                anyString(), any(HttpEntity.class), eq(EasyMsAuthenticationManager.TokenResponse.class)))
                .thenReturn(responseEntity);
        
        // Manually set an expired token in the tokenInfoRef
        authManager.tokenInfoRef.set(new EasyMsAuthenticationManager.TokenInfo(
                "old-token", "old-refresh", Instant.now().minusSeconds(600)));

        // When
        var accessToken = authManager.getAccessToken();

        // Then
        assertEquals("test-access-token", accessToken);
        verify(plainRestTemplate, times(1)).postForEntity(
                anyString(), any(HttpEntity.class), eq(EasyMsAuthenticationManager.TokenResponse.class));
    }

    @Test
    void forceRefreshToken_shouldRefreshTokenRegardlessOfExpiration() throws Exception {
        // Given
        // Set up a mock response for the refresh
        EasyMsAuthenticationManager.TokenResponse mockResponse = createMockTokenResponse();
        mockResponse.setAccessToken("new-access-token");
        ResponseEntity<EasyMsAuthenticationManager.TokenResponse> responseEntity =
                new ResponseEntity<>(mockResponse, HttpStatus.OK);

        when(plainRestTemplate.postForEntity(
                anyString(), any(HttpEntity.class), eq(EasyMsAuthenticationManager.TokenResponse.class)))
                .thenReturn(responseEntity);
        
        // Set a valid token that shouldn't normally be refreshed
        authManager.tokenInfoRef.set(new EasyMsAuthenticationManager.TokenInfo(
                "valid-token", "valid-refresh", Instant.now().plusSeconds(3600)));

        // When
        authManager.forceRefreshToken();
        String accessToken = authManager.getAccessToken();

        // Then
        assertEquals("new-access-token", accessToken);
        verify(plainRestTemplate, times(1)).postForEntity(
                anyString(), any(HttpEntity.class), eq(EasyMsAuthenticationManager.TokenResponse.class));
    }

    private EasyMsAuthenticationManager.TokenResponse createMockTokenResponse() {
        EasyMsAuthenticationManager.TokenResponse response = new EasyMsAuthenticationManager.TokenResponse();
        response.setAccessToken("test-access-token");
        response.setRefreshToken("test-refresh-token");
        response.setExpiresIn(3600); // 1 hour
        response.setTokenType("bearer");
        response.setScope("backoffice");
        response.setJti("test-jti");
        return response;
    }
}
