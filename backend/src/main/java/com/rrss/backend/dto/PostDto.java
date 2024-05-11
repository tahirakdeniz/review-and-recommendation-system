package com.rrss.backend.dto;

import com.rrss.backend.model.Post;

import java.time.LocalDateTime;

public record PostDto(
        Long id,
        TopicUserDto userDto,
        String content,
        LocalDateTime creationDate
) {
    public static PostDto convert(Post from) {
        return new PostDto(
                from.getId(),
                TopicUserDto.convert(from.getCreatedBy(), from.isAnonymous()),
                from.getContent(),
                from.getCreationDate()
        );
    }
}
