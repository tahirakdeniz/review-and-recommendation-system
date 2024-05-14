package com.rrss.backend.dto;

import com.rrss.backend.enums.InteractionWeightType;

public record InteractionWeightRequest(
        InteractionWeightType type,
        Integer weight
) {
}
