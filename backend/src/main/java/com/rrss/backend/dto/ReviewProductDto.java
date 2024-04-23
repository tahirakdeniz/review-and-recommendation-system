package com.rrss.backend.dto;

import com.rrss.backend.model.Product;

import java.math.BigDecimal;

public record ReviewProductDto(
        Long id,
        String name,
        String description,
        ProductCategoryDto productCategoryDto,
        BigDecimal price
) {
    public static ReviewProductDto convert(Product from) {
        return new ReviewProductDto(
                from.getId(),
                from.getName(),
                from.getDescription(),
                ProductCategoryDto.convert(from.getProductCategory()),
                from.getPrice()
        );
    }
}
