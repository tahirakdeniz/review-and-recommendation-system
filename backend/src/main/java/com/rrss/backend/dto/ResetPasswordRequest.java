package com.rrss.backend.dto;

public record ResetPasswordRequest(
        String username,
        String password,
        String otp
) {
}
