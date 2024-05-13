package com.rrss.backend.dto;

import com.rrss.backend.model.Topic;

import java.time.LocalDateTime;
import java.util.List;

public record TopicDto(
        Long id,
        String title,
        BasicUserDto userDto,
        LocalDateTime creationDate,
        List<TopicPostDto> postDtos,
        TopicForumCategoryDto forumCategoryDto,
        Boolean isAnonymous
) {

    public static TopicDto convert(Topic from) {
        return new TopicDto(
                from.getId(),
                from.getTitle(),
                BasicUserDto.convert(from.getCreatedBy(), from.isAnonymous()),
                from.getCreationDate(),
                from.getPosts()
                        .stream()
                        .map(TopicPostDto::convert)
                        .toList(),
                TopicForumCategoryDto.convert(from.getCategory()),
                from.isAnonymous()
        );
    }
}
