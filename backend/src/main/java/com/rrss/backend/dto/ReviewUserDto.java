package com.rrss.backend.dto;

import com.rrss.backend.model.User;

public record ReviewUserDto(
        String id,
        String username,
        RoleDto roleDto
) {
    public static ReviewUserDto convert(User from) {
        return new ReviewUserDto(
                from.getId(),
                from.getUsername(),
                RoleDto.convert(from.getRole())
        );
    }
}
