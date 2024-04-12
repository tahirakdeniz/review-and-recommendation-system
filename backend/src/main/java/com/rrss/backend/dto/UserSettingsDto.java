package com.rrss.backend.dto;

import com.rrss.backend.model.User;

import java.time.LocalDate;

public record UserSettingsDto(
        String id,
        String username,
        String email,
        String description,
        String firstName,
        String lastName,
        String roleName,
        LocalDate dateOfBirth
) {

    public static UserSettingsDto convert(User from) {
        return new UserSettingsDto(
                from.getId(),
                from.getUsername(),
                from.getEmail(),
                from.getDescription(),
                from.getFirstName(),
                from.getLastName(),
                from.getRole().getName(),
                from.getDateOfBirth()
        );
    }
}
