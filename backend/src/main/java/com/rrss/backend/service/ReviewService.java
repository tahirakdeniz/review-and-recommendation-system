package com.rrss.backend.service;

import com.rrss.backend.dto.ReviewFormDto;
import com.rrss.backend.dto.ReviewFormRequest;
import com.rrss.backend.model.ReviewForm;
import com.rrss.backend.repository.ProductCategoryRepository;
import com.rrss.backend.repository.ReviewFormRepository;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {
    private final ReviewFormRepository reviewFormRepository;
    private final ProductCategoryRepository productCategoryRepository;

    public ReviewService(ReviewFormRepository reviewFormRepository, ProductCategoryRepository productCategoryRepository) {
        this.reviewFormRepository = reviewFormRepository;
        this.productCategoryRepository = productCategoryRepository;
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
}
