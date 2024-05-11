package com.rrss.backend.dto;

import com.rrss.backend.model.ReviewForm;

import java.util.List;

public record ReviewFormDto(
        Long id,
        ProductCategoryDto productCategoryDto,
        List<ReviewFieldDto> reviewFieldDtos
) {
    public static ReviewFormDto convert(ReviewForm from) {
        return new ReviewFormDto(
                from.getId(),
                ProductCategoryDto.convert(from.getProductType()),
                from.getFields()
                        .stream()
                        .map(ReviewFieldDto::convert)
                        .toList()
        );
    }
}
