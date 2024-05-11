package com.rrss.backend.dto;

import com.rrss.backend.model.Merchant;

public record UserMerchantDto(
        String id
        MerchantReviewReplyDto reviewReplyDto //TODO YAP BUNU
) {
    public static UserMerchantDto convert(Merchant from) {
        if (from == null)
            return null;
        return new UserMerchantDto(
                from.getId(),
                from.getReviewReplies()
                        .stream()
                        .map(MerchantReviewReplyDto::convert)
                        .toList()
        );
    }
}
