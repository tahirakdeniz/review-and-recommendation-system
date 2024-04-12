package com.rrss.backend.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.rrss.backend.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record RegistrationRequest(

        String username,

        @NotBlank
        @Size(min = 8, max = 20)
        String password,

        @Email
        String email,

        @JsonProperty("first_name")
        String firstName,

        @JsonProperty("last_name")
        String lastName,

        @JsonProperty("date_of_birth")
        LocalDate dateOfBirth,

        String role,

        String otp

) {

}
