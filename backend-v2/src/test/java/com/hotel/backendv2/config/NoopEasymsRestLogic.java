package com.hotel.backendv2.config;

import com.hotel.backendv2.integration.channel.manager.bookings.easyms.EasymsAdapter;
import com.hotel.backendv2.integration.channel.manager.api.client.easyms.EasymsAuthenticationManager;
import com.hotel.backendv2.integration.channel.manager.api.client.easyms.EasymsBearerAuthInterceptor;
import com.hotel.backendv2.integration.channel.manager.api.client.easyms.EasymsRestTemplateConfig;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;

@TestConfiguration
public class NoopEasymsRestLogic {

    @MockBean
    public EasymsRestTemplateConfig easymsRestTemplateConfig;

    @MockBean
    public EasymsAdapter easymsAdapter;

    @MockBean
    public EasymsAuthenticationManager easymsAuthenticationManager;

    @MockBean
    public EasymsBearerAuthInterceptor easymsBearerAuthInterceptor;
}
