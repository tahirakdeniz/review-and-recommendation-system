package com.rrss.backend.service;

import com.rrss.backend.dto.ReviewFieldDto;
import com.rrss.backend.dto.ReviewFieldRequest;
import com.rrss.backend.dto.ReviewFormDto;
import com.rrss.backend.dto.ReviewFormRequest;
import com.rrss.backend.model.ReviewField;
import com.rrss.backend.model.ReviewForm;
import com.rrss.backend.repository.ProductCategoryRepository;
import com.rrss.backend.repository.ReviewFieldRepository;
import com.rrss.backend.repository.ReviewFormRepository;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {
    private final ReviewFormRepository reviewFormRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final ReviewFieldRepository reviewFieldRepository;

    public ReviewService(ReviewFormRepository reviewFormRepository, ProductCategoryRepository productCategoryRepository, ReviewFieldRepository reviewFieldRepository) {
        this.reviewFormRepository = reviewFormRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.reviewFieldRepository = reviewFieldRepository;
    }

    public ReviewFormDto createReviewForm(ReviewFormRequest reviewFormRequest) {
        return ReviewFormDto.convert(
                reviewFormRepository.save(
                        new ReviewForm(
                                reviewFormRequest.name(),
                                productCategoryRepository.findByName(reviewFormRequest.productCategoryName())
                                        .orElseThrow(() -> new RuntimeException("Product category not found"))
                        )
                )
        );

    }

    public ReviewFieldDto addReviewField(Long id, ReviewFieldRequest reviewFieldRequest) {
        ReviewForm reviewForm = reviewFormRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review form not found"));

        ReviewField reviewField = reviewFieldRepository.save(
                new ReviewField(
                        null,
                        reviewFieldRequest.label(),
                        reviewFieldRequest.minScore(),
                        reviewFieldRequest.maxScore()
                )
        );

        reviewForm.getFields().add(reviewField);
        reviewFormRepository.save(reviewForm);

        return ReviewFieldDto.convert(reviewField);
    }

    public ReviewFormDto getReviewForm(String productCategoryName) {
        return ReviewFormDto.convert(
                reviewFormRepository.findByProductTypeName(productCategoryName)
                        .orElseThrow(() -> new RuntimeException("Review form not found"))
        );
    }
}
