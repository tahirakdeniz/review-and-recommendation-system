package com.rrss.backend.dto;

import com.rrss.backend.model.User;

public record BasicUserDto(
        String id,
        String username,
        String firstName,
        String lastName,
        RoleDto role
) {
    public static BasicUserDto convert(User from, boolean isAnonymous) {
        return new BasicUserDto(
                from.getId(),
                isAnonymous ? "Anonymous": from.getUsername(),
                isAnonymous ? "Anonymous": from.getFirstName(),
                isAnonymous ? "Anonymous": from.getLastName(),
                RoleDto.convert(from.getRole())
        );
    }
}
