package com.rrss.backend.dto;

import com.rrss.backend.model.Topic;

import java.time.LocalDateTime;
import java.util.List;

public record ForumCategoryTopicDto(
    Long id,
    String title,
    TopicUserDto userDto,
    LocalDateTime creationDate,
    List<TopicPostDto> postDto
) {
    public static ForumCategoryTopicDto convert(Topic from) {
        return new ForumCategoryTopicDto(
                    from.getId(),
                from.getTitle(),
                TopicUserDto.convert(from.getCreatedBy(), from.isAnonymous()),
                from.getCreationDate(),
                from.getPosts()
                        .stream()
                        .map(TopicPostDto::convert)
                        .toList()
        );
    }
}
