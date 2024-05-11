package com.rrss.backend.dto;

public record UpdateTopicRequest(
        String title,
        boolean isAnonymous
) {
}
