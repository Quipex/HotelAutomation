package com.hotel.backendservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Hotel Management API")
                .description("API for managing hotel bookings, clients, and rooms")
                .version("v1.0.0")
                .contact(new Contact()
                    .name("Hotel Management")
                    .email("contact@hotel.com")
                    .url("https://hotel.com"))
                .license(new License()
                    .name("Private License")
                    .url("https://hotel.com/license")))
            .servers(List.of(
                new Server().url("/").description("Current server")
            ));
    }
}
