package com.rrss.backend.dto;

import com.rrss.backend.enums.MerchantRequestStatus;
import com.rrss.backend.model.MerchantRequest;

import java.time.LocalDateTime;

public record MerchantRequestDto(
        Long id,
        MerchantRequestUserDto merchantRequestUserDto,
        LocalDateTime requestDate,
        LocalDateTime answeredDate,
        String adminCommment,
        MerchantRequestStatus status
) {
    public static MerchantRequestDto convert(MerchantRequest from) {
        return new MerchantRequestDto(
                from.getId(),
                MerchantRequestUserDto.convert(from.getUser()),
                from.getRequestDate(),
                from.getAnsweredDate(),
                from.getAdminComment(),
                from.getStatus()
        );
    }
}
