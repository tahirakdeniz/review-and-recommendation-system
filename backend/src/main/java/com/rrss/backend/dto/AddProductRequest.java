package com.rrss.backend.dto;

import java.math.BigDecimal;

public record AddProductRequest(
        String name,
        String description,
        String productCategoryName,
        BigDecimal price
) {
}
