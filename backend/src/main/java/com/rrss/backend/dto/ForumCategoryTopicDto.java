package com.rrss.backend.dto;

import com.rrss.backend.model.Topic;

import java.time.LocalDateTime;

public record ForumCategoryTopicDto(
    Long id,
    String title,
    BasicUserDto userDto,
    LocalDateTime creationDate,
    Boolean isAnonymous
) {
    public static ForumCategoryTopicDto convert(Topic from) {
        return new ForumCategoryTopicDto(
                from.getId(),
                from.getTitle(),
                BasicUserDto.convert(from.getCreatedBy(), from.isAnonymous()),
                from.getCreationDate(),
                from.isAnonymous()
        );
    }
}
