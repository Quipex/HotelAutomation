package com.hotel.backendv2.integration.channel.manager.api.client.easyms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.support.HttpRequestWrapper;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class EasymsBearerAuthInterceptor implements ClientHttpRequestInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(EasymsBearerAuthInterceptor.class);
    private final EasymsAuthenticationManager authManager;

    public EasymsBearerAuthInterceptor(EasymsAuthenticationManager authManager) {
        this.authManager = authManager;
    }

    @Override
    @NonNull
    public ClientHttpResponse intercept(
        @NonNull HttpRequest request,
        @NonNull byte[] body,
        ClientHttpRequestExecution execution
    ) throws IOException {
        applyBearerToken(request);

        ClientHttpResponse response = execution.execute(request, body);
        int status = response.getStatusCode().value();

        if (status == 401 || status == 403) {
            logger.debug("AuthInterceptor: got {} — refreshing token and retrying", status);
            response.close();

            authManager.forceRefreshToken();

            HttpRequest newReq = new HttpRequestWrapper(request);
            applyBearerToken(newReq);

            ClientHttpResponse retryResp = execution.execute(newReq, body);
            logger.debug("AuthInterceptor: retry response {} {}", retryResp.getStatusCode(), retryResp.getStatusText());
            return retryResp;
        }

        return response;
    }

    private void applyBearerToken(HttpRequest request) {
        String token = authManager.getAccessToken();
        if (token != null && !token.isEmpty()) {
            request.getHeaders().setBearerAuth(token);
        }
    }
}
