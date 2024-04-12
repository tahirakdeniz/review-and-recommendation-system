package com.rrss.backend.dto;

import com.rrss.backend.model.ProductCategory;

public record ProductCategoryDto(
        Long id,
        String name,
        String description
) {
    public static ProductCategoryDto convert(ProductCategory from) {
        return new ProductCategoryDto(
                from.getId(),
                from.getName(),
                from.getDescription()
        );
    }
}
