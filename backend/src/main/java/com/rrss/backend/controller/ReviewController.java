package com.rrss.backend.controller;

import com.rrss.backend.dto.*;
import com.rrss.backend.model.ProductCategory;
import com.rrss.backend.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewFormDto> createReviewForm(@RequestBody ReviewFormRequest reviewFormRequest) {
        return new ResponseEntity<>(reviewService.createReviewForm(reviewFormRequest), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewFieldDto> addReviewField(@PathVariable Long id, @RequestBody ReviewFieldRequest reviewFieldRequest) {
        return ResponseEntity.ok(reviewService.addReviewField(id, reviewFieldRequest));
    }

    @GetMapping()
    public ResponseEntity<ReviewFormDto> getReviewForm(@RequestParam String productCategoryName) {
        return ResponseEntity.ok(reviewService.getReviewForm(productCategoryName));
    }






}
