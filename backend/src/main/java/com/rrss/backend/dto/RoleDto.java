package com.rrss.backend.dto;

import com.rrss.backend.model.Authority;
import com.rrss.backend.model.Role;

import java.util.List;

public record RoleDto(
        Long id,
        String name,
        List<AuthorityDto> authorityDtos
) {
    public static RoleDto convert(Role from) {
        return new RoleDto(
                from.getId(),
                from.getName(),
                from.getAuthorities().stream().map(AuthorityDto::convert).toList()
        );
    }

}
