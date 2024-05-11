package com.rrss.backend.dto;

import java.util.List;

public record ReviewSubmitRequest(
        List<FieldScoreRequest> fieldScores,
        String comment
) {
}
