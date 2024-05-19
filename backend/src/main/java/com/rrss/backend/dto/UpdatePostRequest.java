package com.rrss.backend.dto;

public record UpdatePostRequest(
        String content,
        boolean isAnonymous
        ) {
}
