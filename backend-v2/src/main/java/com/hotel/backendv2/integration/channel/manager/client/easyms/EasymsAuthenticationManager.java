package com.hotel.backendv2.integration.channel.manager.client.easyms;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;

@Component
public class EasymsAuthenticationManager {

    private static final Logger logger = LoggerFactory.getLogger(EasymsAuthenticationManager.class);

    @Value("${easyms.auth.token-refresh-threshold-seconds}")
    private int tokenRefreshThresholdSeconds = 300; // 5 minutes before expiration

    @Value("${easyms.auth.login}")
    private String username;

    @Value("${easyms.auth.password}")
    private String password;

    @Value("${easyms.auth.token-url}")
    private String tokenUrl;

    @Value("${easyms.auth.basic-auth.username}")
    private String basicAuthUsername;

    @Value("${easyms.auth.basic-auth.password}")
    private String basicAuthPassword;

    protected final RestTemplate plainRestTemplate;
    protected final AtomicReference<TokenInfo> tokenInfoRef = new AtomicReference<>();

    public EasymsAuthenticationManager() {
        this.plainRestTemplate = new RestTemplate();
    }

    @PostConstruct
    public void init() {
        refreshToken();
    }

    /**
     * Gets the current access token, refreshing it if necessary
     */
    public String getAccessToken() {
        TokenInfo tokenInfo = tokenInfoRef.get();

        // If token is null or about to expire, refresh it
        if (tokenInfo == null || isTokenAboutToExpire(tokenInfo)) {
            synchronized (this) {
                // Double-check after lock acquisition
                tokenInfo = tokenInfoRef.get();
                if (tokenInfo == null || isTokenAboutToExpire(tokenInfo)) {
                    refreshToken();
                    tokenInfo = tokenInfoRef.get();
                }
            }
        }

        return tokenInfo != null ? tokenInfo.accessToken() : null;
    }

    /**
     * Forces token refresh regardless of expiration
     */
    public void forceRefreshToken() {
        refreshToken();
    }

    /**
     * Checks if the current token should be refreshed
     */
    private boolean isTokenAboutToExpire(TokenInfo tokenInfo) {
        if (tokenInfo.expiresAt() == null) {
            return true;
        }

        Instant now = Instant.now();
        return now.plusSeconds(tokenRefreshThresholdSeconds).isAfter(tokenInfo.expiresAt());
    }

    /**
     * Refreshes the authentication token
     */
    private synchronized void refreshToken() {
        try {
            var headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            // Add Basic Authentication
            String authHeader = basicAuthUsername + ":" + basicAuthPassword;
            String encodedAuth = Base64.getEncoder().encodeToString(authHeader.getBytes(StandardCharsets.UTF_8));
            String basicAuth = "Basic " + encodedAuth;
            headers.add(HttpHeaders.AUTHORIZATION, basicAuth);

            var formData = new LinkedMultiValueMap<String, String>();
            formData.add("username", username);
            formData.add("password", password);
            formData.add("grant_type", "password");

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

            var response = plainRestTemplate.postForEntity(
                    tokenUrl,
                    request,
                    TokenResponse.class
            );

            if (response.getBody() == null) {
                logger.warn("Failed to refresh EasyMS authentication token: empty response body");
                return;
            }

            TokenResponse tokenResponse = response.getBody();
            Instant expiresAt = Instant.now().plusSeconds(tokenResponse.expiresIn);

            TokenInfo tokenInfo = new TokenInfo(
                    tokenResponse.accessToken,
                    tokenResponse.refreshToken,
                    expiresAt
            );

            tokenInfoRef.set(tokenInfo);
            logger.debug("Successfully refreshed EasyMS authentication token, expires at: {}", expiresAt);
        } catch (Exception e) {
            logger.warn("Failed to refresh EasyMS authentication token", e);
            // Keep the existing token if refresh fails
        }
    }

    protected record TokenInfo(String accessToken, String refreshToken, Instant expiresAt) {
    }

    /**
     * DTO to parse token response
     */
    public static class TokenResponse {
        @JsonProperty("access_token")
        public String accessToken;

        @JsonProperty("token_type")
        public String tokenType;

        @JsonProperty("refresh_token")
        public String refreshToken;

        @JsonProperty("expires_in")
        public int expiresIn;

        @JsonProperty("scope")
        public String scope;

        @JsonProperty("jti")
        public String jti;

        public TokenResponse() {
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            TokenResponse that = (TokenResponse) o;
            return expiresIn == that.expiresIn &&
                   Objects.equals(accessToken, that.accessToken) &&
                   Objects.equals(refreshToken, that.refreshToken) &&
                   Objects.equals(tokenType, that.tokenType) &&
                   Objects.equals(scope, that.scope) &&
                   Objects.equals(jti, that.jti);
        }

        @Override
        public int hashCode() {
            return Objects.hash(accessToken, tokenType, refreshToken, expiresIn, scope, jti);
        }

        @Override
        public String toString() {
            return "TokenResponse{" +
                   "accessToken='" + accessToken + '\'' +
                   ", tokenType='" + tokenType + '\'' +
                   ", refreshToken='" + refreshToken + '\'' +
                   ", expiresIn=" + expiresIn +
                   ", scope='" + scope + '\'' +
                   ", jti='" + jti + '\'' +
                   '}';
        }
    }
}
