package com.rrss.backend.dto;

import java.math.BigDecimal;

public record UpdateProductRequest(
    String name,

    String description,

    String productCategoryName,

    BigDecimal price
) {
}
