package com.rrss.backend.dto;

public record AddTopicRequest(
        Long categoryId,
        String title,
        String post,
        boolean isAnonymous
) {
}
