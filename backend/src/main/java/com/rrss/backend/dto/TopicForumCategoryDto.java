package com.rrss.backend.dto;

import com.rrss.backend.model.ForumCategory;

public record TopicForumCategoryDto(
        Long id,
        String name,
        String description
) {
    public static TopicForumCategoryDto convert(ForumCategory from) {
       return new TopicForumCategoryDto(
               from.getId(),
               from.getName(),
               from.getDescription()
       ) ;
    }
}
