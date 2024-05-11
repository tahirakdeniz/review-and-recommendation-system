package com.rrss.backend.dto;

import com.rrss.backend.model.Review;
import com.rrss.backend.model.ReviewReply;

import java.util.List;
import java.util.stream.Collectors;

public record ReviewDto(
        Long id,
        ReviewProductDto reviewProductDto,
        ReviewUserDto userDto,
        List<FieldScoreDto> fieldScoreDtos,
        ReviewReplyDto reviewReplyDto,
        String comment
) {
    public static ReviewDto convert (Review from) {
        return new ReviewDto(
                from.getId(),
                ReviewProductDto.convert(from.getProduct()),
                ReviewUserDto.convert(from.getUser()),
                from.getScores()
                        .stream()
                        .map(FieldScoreDto::convert)
                        .toList(),
                ReviewReplyDto.convert(from.getReply()),
                from.getComment()
        );
    }
}
