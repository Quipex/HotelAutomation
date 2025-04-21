package com.hotel.backendservice.client;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientDto {

    private UUID id;

    @NotNull(message = "First name is required")
    @Size(min = 1, max = 50, message = "First name must be between 1 and 50 characters")
    private String firstName;

    @NotNull(message = "Last name is required")
    @Size(min = 1, max = 50, message = "Last name must be between 1 and 50 characters")
    private String lastName;

    @Size(max = 50, message = "Middle name must be less than 50 characters")
    private String middleName;

    private String[] phones;

    @Email(message = "Email should be valid")
    private String email;

    @Size(max = 2000, message = "Notes should be less than 2000 characters")
    private String notes;
}
