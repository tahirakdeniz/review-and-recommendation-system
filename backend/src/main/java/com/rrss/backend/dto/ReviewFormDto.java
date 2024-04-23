package com.rrss.backend.dto;

import com.rrss.backend.model.ReviewForm;

import java.util.List;
import java.util.stream.Collectors;

public record ReviewFormDto(
        Long id,
        String name,
        ProductCategoryDto productCategoryDto,
        List<ReviewFieldDto> reviewFieldDtos
) {
    public static ReviewFormDto convert(ReviewForm from) {
        return new ReviewFormDto(
                from.getId(),
                from.getName(),
                ProductCategoryDto.convert(from.getProductType()),
                from.getFields().stream().map(ReviewFieldDto::convert).collect(Collectors.toList())
        );
    }
}
