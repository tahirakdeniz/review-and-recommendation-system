package com.rrss.backend.dto;

import com.rrss.backend.model.User;

public record TopicUserDto(
        String id,
        String username,
        String firstName,
        String lastName,
        RoleDto role
) {
    public static TopicUserDto convert(User from, boolean isAnonymous) {
        return new TopicUserDto(
                from.getId(),
                isAnonymous ? "Anonymous": from.getUsername(),
                isAnonymous ? "Anonymous": from.getFirstName(),
                isAnonymous ? "Anonymous": from.getLastName(),
                RoleDto.convert(from.getRole())
        );
    }
}
