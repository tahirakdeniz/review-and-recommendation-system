package com.rrss.backend.dto;

import com.rrss.backend.model.Product;

import java.math.BigDecimal;

public record ProductDto(
        Long id,
        String name,
        String description,
        BasicUserDto topicUserDto,
        String productCategoryName,
        BigDecimal price,
        byte[] photo,
        ProductReviewDto reviewDto,
        boolean disabled
) {
    public static ProductDto convert(Product from) {
        return new ProductDto(
                from.getId(),
                from.getName(),
                from.getDescription(),
                BasicUserDto.convert(from.getMerchant().getUser(), false),
                from.getProductCategory().getName(),
                from.getPrice(),
                from.getPicture(),
                ProductReviewDto.convert(from.getReviews()),
                from.getDisabled()

        );
    }
}
