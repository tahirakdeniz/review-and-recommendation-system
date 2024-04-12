package com.rrss.backend.dto;

import com.rrss.backend.model.CartItem;

public record CartItemDto(
        Long id,
        ProductDto productDto,
        int quatity
) {
    public static CartItemDto convert(CartItem from) {
        return new CartItemDto(
                from.getId(),
                ProductDto.convert(from.getProduct()),
                from.getQuantity()
        );
    }
}
