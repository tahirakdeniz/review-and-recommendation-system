package com.rrss.backend.dto;

import com.rrss.backend.enums.InteractionWeightType;
import com.rrss.backend.model.InteractionWeight;

public record InteractionWeightDto(
        Long id,
        InteractionWeightType type,
        Integer weight
) {
    public static InteractionWeightDto convert(InteractionWeight from) {
        return new InteractionWeightDto(
                from.getId(),
                from.getInteractionType(),
                from.getWeight()
        );
    }
}
