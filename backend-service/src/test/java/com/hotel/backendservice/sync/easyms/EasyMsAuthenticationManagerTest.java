package com.hotel.backendservice.sync.easyms;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Field;
import java.time.Instant;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class EasyMsAuthenticationManagerTest {

    @InjectMocks
    private EasyMsAuthenticationManager authManager;

    @Spy
    private RestTemplate plainRestTemplate = new RestTemplate();

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);

        // Set required properties manually
        ReflectionTestUtils.setField(authManager, "username", "test-user");
        ReflectionTestUtils.setField(authManager, "password", "test-password");
        ReflectionTestUtils.setField(authManager, "tokenUrl", "https://test.easyms.co/oauth/token");
    }

    @Test
    void getAccessToken_shouldReturnTokenFromCache() throws Exception {
        // Given
        var mockResponse = createMockTokenResponse();
        var responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);

        doReturn(responseEntity).when(plainRestTemplate).postForEntity(
                anyString(), any(HttpEntity.class), eq(EasyMsAuthenticationManager.TokenResponse.class));

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
        // Create a token info with an expired token
        setExpiredTokenInfo();

        var mockResponse = createMockTokenResponse();
        var responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);

        doReturn(responseEntity).when(plainRestTemplate).postForEntity(
                anyString(), any(HttpEntity.class), eq(EasyMsAuthenticationManager.TokenResponse.class));

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
        // Set an initial valid token
        setValidTokenInfo();

        EasyMsAuthenticationManager.TokenResponse mockResponse = createMockTokenResponse();
        mockResponse.setAccessToken("new-access-token");
        ResponseEntity<EasyMsAuthenticationManager.TokenResponse> responseEntity =
                new ResponseEntity<>(mockResponse, HttpStatus.OK);

        doReturn(responseEntity).when(plainRestTemplate).postForEntity(
                anyString(), any(HttpEntity.class), eq(EasyMsAuthenticationManager.TokenResponse.class));

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

    @SuppressWarnings("unchecked")
    private void setExpiredTokenInfo() throws Exception {
        // Create an expired token (one that expired 10 minutes ago)
        Object tokenInfo = createTokenInfo("old-token", "old-refresh", Instant.now().minusSeconds(600));

        // Get access to the tokenInfoRef field
        Field tokenInfoRefField = EasyMsAuthenticationManager.class.getDeclaredField("tokenInfoRef");
        tokenInfoRefField.setAccessible(true);

        // Set the expired token
        AtomicReference<Object> tokenInfoRef = (AtomicReference<Object>) tokenInfoRefField.get(authManager);
        tokenInfoRef.set(tokenInfo);
    }

    @SuppressWarnings("unchecked")
    private void setValidTokenInfo() throws Exception {
        // Create a valid token (expires in 1 hour)
        Object tokenInfo = createTokenInfo("valid-token", "valid-refresh", Instant.now().plusSeconds(3600));

        // Get access to the tokenInfoRef field
        Field tokenInfoRefField = EasyMsAuthenticationManager.class.getDeclaredField("tokenInfoRef");
        tokenInfoRefField.setAccessible(true);

        // Set the valid token
        AtomicReference<Object> tokenInfoRef = (AtomicReference<Object>) tokenInfoRefField.get(authManager);
        tokenInfoRef.set(tokenInfo);
    }

    private Object createTokenInfo(String accessToken, String refreshToken, Instant expiresAt) throws Exception {
        // Use reflection to create a TokenInfo instance (since it's a private static class)
        Class<?> tokenInfoClass = Class.forName(
                "com.hotel.backendservice.sync.easyms.EasyMsAuthenticationManager$TokenInfo");
        return tokenInfoClass
                .getDeclaredConstructor(String.class, String.class, Instant.class)
                .newInstance(accessToken, refreshToken, expiresAt);
    }
}
