package com.rrss.backend.dto;

import com.rrss.backend.model.Review;
import java.util.List;

public record UserReviewDto(
        long id,
        UserReviewProductDto userReviewProductDto,
        List<FieldScoreDto> fieldScoreDto,
        ReviewReplyDto reviewReply
) {

    public static UserReviewDto convert(Review from) {
        return new UserReviewDto(
                from.getId(),
                UserReviewProductDto.convert(from.getProduct()),
                from.getScores()
                        .stream()
                        .map(FieldScoreDto::convert)
                        .toList(),
                (from.getReply() == null) ? null : ReviewReplyDto.convert(from.getReply())


        );



    }
}
