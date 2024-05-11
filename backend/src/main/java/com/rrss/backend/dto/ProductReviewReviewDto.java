package com.rrss.backend.dto;

import com.rrss.backend.model.Review;

import java.util.List;

public record ProductReviewReviewDto(
        Long id,
        ReviewUserDto userDto,
        List<FieldScoreDto> fieldScoreDtos
) {
        public static ProductReviewReviewDto convert(Review from) {
                return new ProductReviewReviewDto(
                        from.getId(),
                        ReviewUserDto.convert(from.getUser()),
                        from.getScores()
                                .stream()
                                .map(FieldScoreDto::convert)
                                .toList()
                );
        }

}
