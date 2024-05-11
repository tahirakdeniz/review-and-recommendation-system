package com.rrss.backend.service;

import com.rrss.backend.dto.ReviewReplyDto;
import com.rrss.backend.dto.ReviewReplyRequest;
import com.rrss.backend.exception.ReviewReplyNotFoundException;
import com.rrss.backend.exception.custom.PermissionDeniedException;
import com.rrss.backend.exception.custom.ReviewNotFoundException;
import com.rrss.backend.model.Review;
import com.rrss.backend.model.ReviewReply;
import com.rrss.backend.model.User;
import com.rrss.backend.repository.ReviewReplyRepository;
import com.rrss.backend.repository.ReviewRepository;
import com.rrss.backend.util.UserUtil;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Objects;

@Service
public class ReviewReplyService {
    private final ReviewRepository reviewRepository;
    private final ReviewReplyRepository repository;
    private final UserUtil userUtil;

    public ReviewReplyService(ReviewRepository reviewRepository, ReviewReplyRepository repository, UserUtil userUtil) {
        this.reviewRepository = reviewRepository;
        this.repository = repository;
        this.userUtil = userUtil;
    }

    public ReviewReplyDto createReviewReply(Principal currentUser, Long reviewId, ReviewReplyRequest reviewReplyRequest) {
        var user = userUtil.extractUser(currentUser);

        var review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("review not found"));

        if (!Objects.equals(review.getProduct().getMerchant().getUser().getId(), user.getId())) {
            throw new PermissionDeniedException("review does not belong to user");
        }

        var reviewReply = new ReviewReply(
                review,
                Objects.requireNonNull(user.getMerchant()),
                reviewReplyRequest.content()
        );

        var savedReviewReply = repository.save(reviewReply);

        reviewRepository.save(
                new Review(
                        review.getId(),
                        review.getProduct(),
                        review.getUser(),
                        review.getScores(),
                        savedReviewReply,
                        review.getComment()
                )
        );

        return ReviewReplyDto.convert(savedReviewReply);
    }

    public ReviewReplyDto updateReviewReply(Principal currentUser, Long reviewReplyId, ReviewReplyRequest reviewReplyRequest) {
        User user = userUtil.extractUser(currentUser);

        var oldReviewReply = repository.findById(reviewReplyId)
                .orElseThrow(() -> new ReviewReplyNotFoundException("review reply not found"));

        if (!Objects.equals(oldReviewReply.getMerchant().getUser().getId(), user.getId())) {
            throw new PermissionDeniedException("reply does not belong to user");
        }

        var reviewReply = repository.save(
                new ReviewReply(
                    oldReviewReply.getId(),
                    oldReviewReply.getReview(),
                    Objects.requireNonNull(user.getMerchant()),
                    reviewReplyRequest.content(),
                    oldReviewReply.getReplyDate()
            )
        );

        var review = oldReviewReply.getReview();

        reviewRepository.save(
                new Review(
                        review.getId(),
                        review.getProduct(),
                        review.getUser(),
                        review.getScores(),
                        reviewReply,
                        review.getComment()
                )
        );


        return ReviewReplyDto.convert(reviewReply);

    }

    public String deleteReviewReply(Principal currentUser, Long reviewReplyId) {
        User user = userUtil.extractUser(currentUser);

        var reviewReply = repository.findById(reviewReplyId)
                .orElseThrow(() -> new ReviewReplyNotFoundException("review reply not found"));

        // check reply belongs to user
        if (!Objects.equals((reviewReply.getMerchant().getUser().getId()), user.getId())) {
            throw new PermissionDeniedException("reply does not belong to user");
        }


        // make reviewreply null from review and save
        var oldReviewReply = reviewReply.getReview();

        reviewRepository.save(
                new Review(
                        oldReviewReply.getId(),
                        oldReviewReply.getProduct(),
                        oldReviewReply.getUser(),
                        oldReviewReply.getScores(),
                        oldReviewReply.getComment()
                )
        );


        // delete review reply
        repository.deleteById(reviewReplyId);

        return "reply deleted successfully";
    }
}
