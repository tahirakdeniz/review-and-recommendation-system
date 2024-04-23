package com.rrss.backend.dto;

import com.rrss.backend.model.Merchant;

public record UserMerchantDto(
        String id
        //List<MerchantReviewReplyDto> reviewReplyDtos,
) {
    public static UserMerchantDto convert(Merchant from) {
        if (from == null)
            return null;
        return new UserMerchantDto(
                from.getId()
                //from.getReviewReplies().stream().map(MerchantReviewReplyDto::convert).collect(Collectors.toList())
        );
    }
}
