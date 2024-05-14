package com.rrss.backend.dto;

import com.rrss.backend.enums.ForumCategoryHeader;

public record AddForumCategoryRequest(
        String name,
        String description,
        ForumCategoryHeader header
) {
}
