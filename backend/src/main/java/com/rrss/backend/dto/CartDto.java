package com.rrss.backend.dto;

import java.util.List;

public record CartDto(
        long id,
        UserDto userDto,
        List<CartItemDto> cartItemDtos
) {
}
