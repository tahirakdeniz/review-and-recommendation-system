package com.rrss.backend.dto;

import com.rrss.backend.model.Post;

import java.time.LocalDateTime;

public record TopicPostDto(
        Long id,
        String content,
        LocalDateTime creationDate
) {
    public static TopicPostDto convert(Post from) {
        return new TopicPostDto(
                from.getId(),
                from.getContent(),
                from.getCreationDate()
        );
    }
}
