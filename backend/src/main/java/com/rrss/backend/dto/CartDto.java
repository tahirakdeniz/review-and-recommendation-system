package com.rrss.backend.dto;

import com.rrss.backend.model.Cart;
import com.rrss.backend.model.CartItem;

import java.math.BigDecimal;
import java.util.List;


public record CartDto(
        long id,
        List<CartItemDto> cartItemDtos,
        BigDecimal totalPrice
) {
    public static CartDto convert(Cart from) {
        BigDecimal totalPrice = BigDecimal.ZERO;

        for(CartItem cartItem: from.getItems()) {
            totalPrice = totalPrice.add(cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        return new CartDto(
                from.getId(),
                from.getItems()
                        .stream()
                        .map(CartItemDto::convert)
                        .toList(),
                        totalPrice
        );
    }
}
