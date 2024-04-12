package com.rrss.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rrss.backend.model.ConfirmationToken;

import java.time.LocalDateTime;

public record ConfirmationTokenDto(

        String email,

        @JsonProperty("expiration_time")
        LocalDateTime expirationTime


) {

    public static ConfirmationTokenDto convert(ConfirmationToken from) {
        return new ConfirmationTokenDto(
                from.getEmail(),
                from.getExpirationTime()
        );
    }
}
