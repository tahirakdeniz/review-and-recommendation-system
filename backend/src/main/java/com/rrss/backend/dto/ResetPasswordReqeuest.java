package com.rrss.backend.dto;

public record ResetPasswordReqeuest(
        String username,
        String password,
        String otp
) {
}
