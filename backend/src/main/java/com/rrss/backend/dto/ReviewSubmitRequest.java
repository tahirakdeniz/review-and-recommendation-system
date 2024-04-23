package com.rrss.backend.dto;

import java.util.List;

public record ReviewSubmitRequest(
        long productId,
        List<FieldScoreDto> fieldScores,
        String comment
) {
}
