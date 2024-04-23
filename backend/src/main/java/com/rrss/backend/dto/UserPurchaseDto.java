package com.rrss.backend.dto;

import com.rrss.backend.model.Purchase;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record UserPurchaseDto(
       Long id,
       List<PurchaseItemDto> purchaseItemDtoList,
       BigDecimal totalCost,
       LocalDateTime purchaseDate
) {
    public static UserPurchaseDto convert(Purchase from) {
        return new UserPurchaseDto(
                from.getId(),
                from.getItems().stream().map(PurchaseItemDto::convert).toList(),
                from.getTotalCost(),
                from.getPurchaseDate()
        );
    }
}
