package com.rrss.backend.dto;

import com.rrss.backend.model.ForumCategory;

public record ForumCategoryDto(

        Long id,
        String name,
        String description,
        List<ForumCategoryTopicDto> topicDtos

) {

    public static ForumCategoryDto convert(ForumCategory from) {
        return new ForumCategoryDto(
                from.getId(),
                from.getName(),
                from.getDescription(),

        );
    }
}
