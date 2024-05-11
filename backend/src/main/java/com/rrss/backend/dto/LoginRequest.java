package com.rrss.backend.dto;

public record LoginRequest(
        String username,
        String password
) {
}
