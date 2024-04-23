package com.rrss.backend.dto;

public record ReviewFieldRequest(
        String label,
        int minScore,
        int maxScore
) {
}
