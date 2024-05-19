package com.rrss.backend.dto;

import com.rrss.backend.model.WishlistItem;

import java.time.LocalDateTime;

public record WishListItemDto(
        Long id,
        ProductDto productDto,
        LocalDateTime addedOn
) {

    public static WishListItemDto convert(WishlistItem from) {
        return new WishListItemDto(
                from.getId(),
                ProductDto.convert(from.getProduct()),
                from.getAddedOn()
        );
    }
}
