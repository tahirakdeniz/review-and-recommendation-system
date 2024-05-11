package com.rrss.backend.dto;

public record AddTopicRequest(
        String categoryName,
        String title,
        String post,
        boolean isAnonymous
) {
}
