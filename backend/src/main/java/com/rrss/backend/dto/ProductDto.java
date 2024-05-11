package com.rrss.backend.dto;

import com.rrss.backend.model.Product;

import java.math.BigDecimal;
import java.util.List;

public record ProductDto(
        Long id,
        String name,
        String description,
        String userId,
        String productCategoryName,
        BigDecimal price,
        byte[] photo,
        ProductReviewDto reviewDto
) {
    public static ProductDto convert(Product from) {
        return new ProductDto(
                from.getId(),
                from.getName(),
                from.getDescription(),
                from.getMerchant().getUser().getId(),
                from.getProductCategory().getName(),
                from.getPrice(),
                from.getPicture(),
                ProductReviewDto.convert(from.getReviews())

        );
    }
}
