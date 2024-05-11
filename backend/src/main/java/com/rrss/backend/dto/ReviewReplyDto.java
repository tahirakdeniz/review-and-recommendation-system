package com.rrss.backend.dto;

import com.rrss.backend.model.ReviewReply;

public record ReviewReplyDto(
        Long id,
        String content
) {
    public static ReviewReplyDto convert(ReviewReply from) {
        return new ReviewReplyDto(
                from.getId(),
                from.getContent()
        );
    }
}
