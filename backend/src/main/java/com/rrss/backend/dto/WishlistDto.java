package com.rrss.backend.dto;

import com.rrss.backend.model.Wishlist;

import java.util.List;

public record WishlistDto(
        Long id,
        BasicUserDto userDto,
        List<WishListItemDto> wishListItemDtoList
) {

    public static WishlistDto convert(Wishlist from) {
        return new WishlistDto(
                from.getId(),
                BasicUserDto.convert(from.getUser(),false),
                from.getItems()
                        .stream()
                        .map(WishListItemDto::convert)
                        .toList()
        );
    }
}
