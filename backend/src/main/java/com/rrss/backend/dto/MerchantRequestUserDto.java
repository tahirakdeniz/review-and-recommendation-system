package com.rrss.backend.dto;

import com.rrss.backend.model.User;

public record MerchantRequestUserDto(
        String username,
        String email,
        String description,
        String firstName,
        String lastName,
        RoleDto role

) {
    public static MerchantRequestUserDto convert(User from) {
        return new MerchantRequestUserDto(
                from.getUsername(),
                from.getEmail(),
                from.getDescription(),
                from.getFirstName(),
                from.getLastName(),
                RoleDto.convert(from.getRole())
        );
    }
}
