package com.rrss.backend.dto;

import com.rrss.backend.model.Product;

import java.math.BigDecimal;
import java.util.List;

// TODO PRODUCT DTO IMAGE DONDURECEK
public record ProductDto(
        Long id,
        String name,
        String description,
        String userId,
        String productCategoryName,
        BigDecimal price,
        byte[] photo,
        List<ReviewDto> reviewDtos,
        double averageReviewScore
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
                from.getReviews()
                        .stream()
                        .map(ReviewDto::convert)
                        .toList(),


        );
    }
}
