package com.rrss.backend.dto;

public record FieldScoreRequest(
        long fieldId,
        int score
) {
}
