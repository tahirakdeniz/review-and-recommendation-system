package com.rrss.backend.dto;

import com.rrss.backend.model.Purchase;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PurchaseDto(
        Long id,
        List<PurchaseItemDto> purchaseItemDtos,
        BigDecimal totalCost,
        LocalDateTime purchaseDate
) {
    public static PurchaseDto convert(Purchase from) {
        return new PurchaseDto(
                from.getId(),
                from.getItems().stream().map(PurchaseItemDto::convert).toList(),
                from.getTotalCost(),
                from.getPurchaseDate()
        );
    }
}
