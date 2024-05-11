package com.rrss.backend.dto;

public record AddPostRequest(
        String content,
        boolean isAnonymous,
        Long topicId
) {
}
