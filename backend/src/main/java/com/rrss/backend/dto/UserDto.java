package com.rrss.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record UserDto(
        String id,
        String username,
        String email,
        String description,
        String firstName,
        String lastName,
        String role,
        LocalDate dateOfBirth,
        UserMerchantDto merchantDto,
        //List<UserReviewDto> reviewDtos
        BigDecimal accountBalance,
        UserCartDto cartDto,
        BigDecimal socialCredit,
        List<UserPurchaseDto> purchaseDtos


) {
}
