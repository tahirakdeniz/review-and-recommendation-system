package com.rrss.backend.dto;

import com.rrss.backend.model.Review;

import java.util.List;

public record ReviewDto(
        Long id,
        ReviewProductDto reviewProductDto,
        ReviewUserDto userDto,
        List<FieldScoreDto> fieldScoreDtos,
        ReviewReplyDto reviewReplyDto,
        String comment,
        boolean isDeleted
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
                (from.getReply() == null) ? null : ReviewReplyDto.convert(from.getReply()),
                from.getComment(),
                from.isDeleted()
        );
    }
}
