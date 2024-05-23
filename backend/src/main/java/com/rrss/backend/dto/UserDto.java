package com.rrss.backend.dto;

import com.rrss.backend.model.User;

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
        List<UserReviewDto> reviewDtos,
        BigDecimal accountBalance,
        UserCartDto cartDto,
        BigDecimal socialCredit,
        List<UserPurchaseDto> purchaseDtos,
        boolean banned
) {
    public static UserDto convert(User from) {
        return new UserDto(
                from.getId(),
                from.getUsername(),
                from.getEmail(),
                from.getDescription(),
                from.getFirstName(),
                from.getLastName(),
                from.getRole().getName(),
                from.getDateOfBirth(),
                UserMerchantDto.convert(from.getMerchant()),
                from.getReviews()
                        .stream()
                        .map(UserReviewDto::convert)
                        .toList(),
                from.getAccountBalance(),
                UserCartDto.convert(from.getCart()),
                from.getSocialCredit(),
                from.getPurchases()
                        .stream()
                        .map(UserPurchaseDto::convert)
                        .toList(),
                !from.isAccountNonLocked()
        );
    }
}
