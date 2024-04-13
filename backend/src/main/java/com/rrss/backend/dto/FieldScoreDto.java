package com.rrss.backend.dto;

import com.rrss.backend.model.FieldScore;

public record FieldScoreDto(
        ReviewFieldDto reviewFieldDto,
        int score
) {
    public static FieldScoreDto convert(FieldScore from) {
        return new FieldScoreDto(
                ReviewFieldDto.convert(from.getReviewField()),
                from.getScore()
        );
    }
}
