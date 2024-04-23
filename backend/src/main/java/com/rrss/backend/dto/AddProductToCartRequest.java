package com.rrss.backend.dto;

public record AddProductToCartRequest(
        Long productId,
        Integer quantity
) {
}
