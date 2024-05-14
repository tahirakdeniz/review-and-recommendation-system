package com.rrss.backend.dto;

import com.rrss.backend.enums.ForumCategoryHeader;
import com.rrss.backend.model.ForumCategory;
import java.util.List;

public record ForumCategoryDto(
        Long id,
        String name,
        String description,
        List<ForumCategoryTopicDto> topicDtos,
        ForumCategoryHeader forumCategoryHeader,
        Integer topicCount,
        Integer messageCount
) {

    public static ForumCategoryDto convert(ForumCategory from) {
        return new ForumCategoryDto(
                from.getId(),
                from.getName(),
                from.getDescription(),
                from.getTopics()
                        .stream()
                        .map(ForumCategoryTopicDto::convert)
                        .toList(),
                from.getHeader(),
                from.getTopics().size(),
                from.getTopics()
                        .stream()
                        .map(topic -> topic.getPosts().size())
                        .reduce(0, Integer::sum)
        );
    }
}
