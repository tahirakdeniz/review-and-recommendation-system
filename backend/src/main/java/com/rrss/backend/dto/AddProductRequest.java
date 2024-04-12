package com.rrss.backend.dto;

public record AddProductRequest(
        String name,
        String description,
        String productCategoryName,
        Double price
) {
}
