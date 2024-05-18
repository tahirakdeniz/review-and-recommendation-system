package com.rrss.backend.dto;

import com.rrss.backend.model.Wishlist;

import java.util.List;

public record WishlistDto(
        Long id,
        List<WishListItemDto> wishListItemDtoList
) {

    public static WishlistDto convert(Wishlist from) {
        return new WishlistDto(
                from.getId(),
                from.getItems()
                        .stream()
                        .map(WishListItemDto::convert)
                        .toList()
        );
    }
}
