package com.rrss.backend.dto;

import com.rrss.backend.model.Review;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public record ProductReviewDto(
        List<ProductReviewReviewDto> reviews,
        double averageScore,
        HashMap<String, Double> fieldAverageScore
) {
    public static ProductReviewDto convert(List<Review> reviews) {
        HashMap<String, Double> fieldTotalScore = new HashMap<>();
        HashMap<String, Integer> fieldScoreCount = new HashMap<>();
        List<ProductReviewReviewDto> reviewDtos = new ArrayList<>();

        reviews.forEach(review -> {
            reviewDtos.add(ProductReviewReviewDto.convert(review));
            review.getScores().forEach(reviewScore -> {
                String label = reviewScore.getReviewField().getLabel();
                double score = reviewScore.getScore();

                fieldTotalScore.merge(label, score, Double::sum);
                fieldScoreCount.merge(label, 1, Integer::sum);
            });
        });

        HashMap<String, Double> fieldAverageScore = new HashMap<>();
        fieldTotalScore.forEach((label, totalScore) -> {
            int count = fieldScoreCount.getOrDefault(label, 1);
            fieldAverageScore.put(label, totalScore / count);
        });

        return new ProductReviewDto(
                reviewDtos,
                fieldAverageScore.values()
                        .stream()
                        .mapToDouble(Double::doubleValue)
                        .average()
                        .orElse(0),
                fieldAverageScore
        );
    }
}

