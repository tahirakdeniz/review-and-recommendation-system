package com.rrss.backend.dto;

import com.rrss.backend.model.PurchaseItem;

import java.math.BigDecimal;

public record PurchaseItemDto(
        Long id,
        ProductDto productDto,
        BigDecimal priceAtPurchase,
        int quantity
) {
    public static PurchaseItemDto convert(PurchaseItem from) {
        return new PurchaseItemDto(
                from.getId(),
                ProductDto.convert(from.getProduct()),
                from.getPriceAtPurchase(),
                from.getQuantity()
        );
    }
}
