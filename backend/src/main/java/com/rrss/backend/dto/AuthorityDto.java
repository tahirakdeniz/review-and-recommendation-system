package com.rrss.backend.dto;

import com.rrss.backend.model.Authority;

public record AuthorityDto(
        Long id,
        String name
) {
    public static AuthorityDto convert(Authority from) {
        return new AuthorityDto(
                from.getId(),
                from.getName()
        );
    }
}
