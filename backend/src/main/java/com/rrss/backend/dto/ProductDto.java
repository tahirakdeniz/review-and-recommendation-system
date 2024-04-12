package com.rrss.backend.dto;

import com.rrss.backend.model.Product;

import java.math.BigDecimal;

public record ProductDto(
        Long id,
        String name,
        String description,
        String userId,
        String productCategoryName,
        BigDecimal price
) {
    public static ProductDto convert(Product from) {
        return new ProductDto(
                from.getId(),
                from.getName(),
                from.getDescription(),
                from.getMerchant().getId(),
                from.getProductCategory().getName(),
                from.getPrice()
        );
    }
}
