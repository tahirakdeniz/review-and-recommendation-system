package com.rrss.backend.controller;

import com.rrss.backend.dto.*;
import com.rrss.backend.model.ProductCategory;
import com.rrss.backend.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_REVIEW')")
    public ResponseEntity<ReviewFormDto> createReviewForm(@RequestBody ReviewFormRequest reviewFormRequest) {
        return new ResponseEntity<>(reviewService.createReviewForm(reviewFormRequest), HttpStatus.CREATED);
    }

    @GetMapping("/form")
    public ResponseEntity<ReviewFormDto> getReviewForm(@RequestParam String productCategoryName) {
        return ResponseEntity.ok(reviewService.getReviewForm(productCategoryName));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_REVIEW')")
    public ResponseEntity<List<ReviewFormDto>> getAllReviewForms() {
        return ResponseEntity.ok(reviewService.getAllReviewForms());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_REVIEW')")
    public ResponseEntity<ReviewFieldDto> addReviewField(@PathVariable Long id, @RequestBody ReviewFieldRequest reviewFieldRequest) {
        return ResponseEntity.ok(reviewService.addReviewField(id, reviewFieldRequest));
    }

    @PutMapping("/{id}/fields/{fieldId}")
    @PreAuthorize("hasAuthority('MANAGE_REVIEW')")
    public ResponseEntity<ReviewFieldDto> updateReviewField(@PathVariable Long id, @PathVariable Long fieldId, @RequestBody ReviewFieldRequest reviewFieldRequest) {
        return ResponseEntity.ok(reviewService.updateReviewField(id, fieldId, reviewFieldRequest));
    }

    @DeleteMapping("/{id}/fields/{fieldId}")
    @PreAuthorize("hasAuthority('MANAGE_REVIEW')")
    public ResponseEntity<String> deleteReviewField(@PathVariable Long id, @PathVariable Long fieldId) {
        return new ResponseEntity<>(reviewService.deleteReviewField(id, fieldId), HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ReviewDto> submitReview(Principal currentUser, @PathVariable Long productId, @RequestBody ReviewSubmitRequest reviewSubmitRequest) {
        return new ResponseEntity<>(reviewService.submitReview(currentUser, productId, reviewSubmitRequest), HttpStatus.CREATED);
    }

    @PutMapping("/update/{reviewId}")
    public ResponseEntity<ReviewDto> updateReview(Principal currentUser, @PathVariable Long reviewId, @RequestBody ReviewSubmitRequest reviewSubmitRequest){
        return ResponseEntity.ok(reviewService.updateReview(currentUser,reviewId,reviewSubmitRequest));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(Principal currentUser, @PathVariable Long reviewId) {
        return ResponseEntity.ok(reviewService.deleteReview(currentUser,reviewId));
    }

}
