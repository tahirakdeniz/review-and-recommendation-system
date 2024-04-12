package com.rrss.backend.dto;

import com.rrss.backend.model.ReviewField;

public record ReviewFieldDto(
        Long id,
        String label,
        int minScore,
        int maxScore
) {
    public static ReviewFieldDto convert(ReviewField from) {
        return new ReviewFieldDto(
                from.getId(),
                from.getLabel(),
                from.getMinScore(),
                from.getMaxScore()
        );
    }
}
