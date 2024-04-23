package com.rrss.backend.dto;

import com.rrss.backend.model.Review;

import java.util.List;
import java.util.stream.Collectors;

public record ReviewDto(
        Long id,
        ReviewProductDto reviewProductDto,
        ReviewUserDto userDto,
        List<FieldScoreDto> fieldScoreDtos,
        List<FlagDto> flagDtos,
        // reply
        String comment
) {
    public static ReviewDto convert (Review from) {
        return new ReviewDto(
                from.getId(),
                ReviewProductDto.convert(from.getProduct()),
                ReviewUserDto.convert(from.getUser()),
                from.getScores().stream().map(FieldScoreDto::convert).collect(Collectors.toList()),
                from.getFlags().stream().map(FlagDto::convert).collect(Collectors.toList()),
                from.getComment()
        );
    }
}
