package com.rrss.backend.dto;

import com.rrss.backend.model.Cart;

import java.util.List;

public record UserCartDto (
        Long id,
        List<CartItemDto> cartItemDtoList
) {
    public static UserCartDto convert(Cart from) {
        return new UserCartDto(
                from.getId(),
                from.getItems()
                        .stream()
                        .map(CartItemDto::convert).toList()
        );
    }
}
