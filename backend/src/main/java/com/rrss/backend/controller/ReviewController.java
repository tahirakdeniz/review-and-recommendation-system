package com.rrss.backend.controller;

import com.rrss.backend.dto.ReviewFormDto;
import com.rrss.backend.dto.ReviewFormRequest;
import com.rrss.backend.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewFormDto> createReviewForm(@RequestBody ReviewFormRequest reviewFormRequest) {
        return new ResponseEntity<>(reviewService.createReviewForm(reviewFormRequest), HttpStatus.CREATED);
    }

}
