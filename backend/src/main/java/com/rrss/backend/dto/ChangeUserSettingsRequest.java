package com.rrss.backend.dto;

import java.time.LocalDate;

public record ChangeUserSettingsRequest(
        String username,
        String description,
        String firstName,
        String lastName,
        LocalDate dateOfBirth
) {
}
