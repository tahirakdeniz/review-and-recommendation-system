package com.rrss.backend.dto;

import com.rrss.backend.model.Merchant;

import java.util.List;

public record UserMerchantDto(
        String id,
        List<ReviewReplyDto> reviewReplyDto
) {
    public static UserMerchantDto convert(Merchant from) {
        if (from == null)
            return null;
        return new UserMerchantDto(
                from.getId(),
                from.getReviewReplies()
                        .stream()
                        .map(ReviewReplyDto::convert)
                        .toList()
        );
    }
}
