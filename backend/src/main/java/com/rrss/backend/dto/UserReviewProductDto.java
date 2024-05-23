package com.rrss.backend.dto;

import com.rrss.backend.model.Product;

public record UserReviewProductDto(
    long id,
    String name,
    boolean disabled

) {
    public static UserReviewProductDto convert(Product from) {
        return new UserReviewProductDto(
                from.getId(),
                from.getName(),
                from.getDisabled()
        );
    }
}
