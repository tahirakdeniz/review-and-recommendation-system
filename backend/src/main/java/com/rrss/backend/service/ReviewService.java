package com.rrss.backend.service;

import com.rrss.backend.dto.*;
import com.rrss.backend.exception.custom.*;
import com.rrss.backend.model.*;
import com.rrss.backend.repository.*;
import com.rrss.backend.util.UserUtil;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    private final ReviewFormRepository reviewFormRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final ReviewFieldRepository reviewFieldRepository;
    private final UserUtil userUtil;
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final FieldScoreRepository fieldScoreRepository;

    public ReviewService(ReviewFormRepository reviewFormRepository, ProductCategoryRepository productCategoryRepository, ReviewFieldRepository reviewFieldRepository, UserUtil userUtil, ReviewRepository reviewRepository, ProductRepository productRepository, FieldScoreRepository fieldScoreRepository) {
        this.reviewFormRepository = reviewFormRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.reviewFieldRepository = reviewFieldRepository;
        this.userUtil = userUtil;
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.fieldScoreRepository = fieldScoreRepository;
    }

    public ReviewFormDto createReviewForm(ReviewFormRequest reviewFormRequest) {
        if (reviewFormRepository.existsByproductTypeName(reviewFormRequest.productCategoryName())) {
            throw new ProductCategoryAlreadyExistException("Product category name already exists");
        }

        return ReviewFormDto.convert(
                reviewFormRepository.save(
                        new ReviewForm(
                                productCategoryRepository.findByName(reviewFormRequest.productCategoryName())
                                        .orElseThrow(() -> new ProductCategoryNotFoundException("Product category not found"))
                        )
                )
        );
    }

    public ReviewFieldDto addReviewField(Long id, ReviewFieldRequest reviewFieldRequest) {
        ReviewForm reviewForm = reviewFormRepository.findById(id)
                .orElseThrow(() -> new ReviewFormNotFoundException("Review form not found"));


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
                        .orElseThrow(() -> new ReviewFormNotFoundException("Review form not found"))
        );
    }

    public String deleteReviewField(Long id, Long fieldId) {
        ReviewForm reviewForm = reviewFormRepository.findById(id)
                .orElseThrow(() -> new ReviewFormNotFoundException("Review form not found"));

        ReviewField reviewField = reviewFieldRepository.findById(fieldId)
                .orElseThrow(() -> new ReviewFieldNotFoundException("Review field not found"));

        reviewForm.getFields().remove(reviewField);
        reviewFormRepository.save(reviewForm);

        reviewFieldRepository.delete(reviewField);

        return "Review field deleted";
    }

    public ReviewFieldDto updateReviewField(Long id, Long fieldId, ReviewFieldRequest reviewFieldRequest) {
        ReviewForm reviewForm = reviewFormRepository.findById(id)
                .orElseThrow(() -> new ReviewFormNotFoundException("Review form not found"));

        ReviewField reviewField = reviewFieldRepository.findById(fieldId)
                .orElseThrow(() -> new ReviewFieldNotFoundException("Review field not found"));

        reviewForm.getFields().remove(reviewField);

        ReviewField newReviewField = reviewFieldRepository.save(
                new ReviewField(
                    reviewField.getId(),
                    reviewFieldRequest.label(),
                    reviewFieldRequest.minScore(),
                    reviewFieldRequest.maxScore()
                )
        );

        reviewForm.getFields().add(newReviewField);
        reviewFormRepository.save(reviewForm);

        return ReviewFieldDto.convert(newReviewField);
    }


    @Transactional
    public ReviewDto submitReview(Principal currentUser, Long productId, ReviewSubmitRequest reviewSubmitRequest) {
        var user = userUtil.extractUser(currentUser);

        // Check if the user has bought the product
        boolean boughtProduct = user
                .getPurchases()
                .stream()
                .anyMatch(purchase -> purchase.getItems().stream()
                        .anyMatch(item -> Objects.equals(item.getProduct().getId(), productId)));

        if (!boughtProduct) {
            throw new PermissionDeniedException("User has not bought the product");
        }

        Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        var review = reviewRepository.save(
                new Review(
                        product,
                        user,
                        reviewSubmitRequest.comment()
                )
        );

        List<FieldScore> fieldScores = reviewSubmitRequest
                .fieldScores()
                .stream()
                .map(scoreDto ->
                        fieldScoreRepository.save(
                                new FieldScore(
                                    new FieldScoreId(0L, scoreDto.fieldId()),
                                    review,
                                    reviewFieldRepository.findById(scoreDto.fieldId())
                                        .orElseThrow(() -> new ReviewFieldNotFoundException("Review field not found")),
                                    scoreDto.score()
                                )
                        )
                )
                .toList();

        review.getScores().addAll(fieldScores);

        var reviewWithFields = reviewRepository.save(review);

        product.getReviews().add(reviewWithFields);
        productRepository.save(product);

        return ReviewDto.convert(reviewWithFields);
    }

    public List<ReviewFormDto> getAllReviewForms() {
        return reviewFormRepository
                .findAll()
                .stream()
                .map(ReviewFormDto::convert)
                .toList();
    }

    public ReviewDto updateReview(Principal currentUser, Long reviewId, ReviewSubmitRequest reviewSubmitRequest) {
        var user = userUtil.extractUser(currentUser);

        var review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found"));

        if(!Objects.equals(user.getId(), review.getUser().getId())) {
            throw new PermissionDeniedException("You are not allowed to do that.");
        }

        Product product = review.getProduct();

        var newReview = reviewRepository.save(
                new Review(
                        review.getId(),
                        product,
                        review.getUser(),
                        reviewSubmitRequest.comment()
                )
        );

        List<FieldScore> fieldScores = reviewSubmitRequest
                .fieldScores()
                .stream()
                .map(scoreDto ->
                        fieldScoreRepository.save(
                                new FieldScore(
                                        new FieldScoreId(0L, scoreDto.fieldId()),
                                        newReview,
                                        reviewFieldRepository.findById(scoreDto.fieldId())
                                                .orElseThrow(() -> new ReviewFieldNotFoundException("Review field not found")),
                                        scoreDto.score()
                                )
                        )
                )
                .toList();

        newReview.getScores().addAll(fieldScores);

        var reviewWithFields = reviewRepository.save(newReview);

        product.getReviews().add(reviewWithFields);
        productRepository.save(product);

        return ReviewDto.convert(reviewWithFields);

    }

    public String deleteReview(Principal currentUser, Long reviewId) {
        var user = userUtil.extractUser(currentUser);

        var review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found"));

        if (!Objects.equals(user.getId(), review.getUser().getId())) {
            throw new PermissionDeniedException("You are not allowed to do that.");
        }

        Product product = review.getProduct();

        // Remove all associated field scores
        fieldScoreRepository.deleteAllByReviewId(review.getId());

        // Remove the review itself
        reviewRepository.delete(review);

        // Update the product's review list if necessary
        product.getReviews().removeIf(r -> Objects.equals(r.getId(), reviewId));
        productRepository.save(product);

        return "Review deleted successfully";
    }
}
