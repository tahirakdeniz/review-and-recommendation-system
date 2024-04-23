package com.rrss.backend.dto;

import com.rrss.backend.model.ReviewFlag;

import java.time.LocalDateTime;

public record FlagDto(
        ReviewUserDto flaggedBy,
        String reason,
        LocalDateTime flagDate
) {
    public static FlagDto convert(ReviewFlag from) {
        return new FlagDto(
                ReviewUserDto.convert(from.getFlaggedBy()),
                from.getReason(),
                from.getFlagDate()
        );
    }
}
