package com.rrss.backend.controller;

import com.rrss.backend.dto.ReviewReplyDto;
import com.rrss.backend.dto.ReviewReplyRequest;
import com.rrss.backend.service.ReviewReplyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController("/api/v1/review-reply")
public class ReviewReplyController {

    private final ReviewReplyService reviewReplyService;

    public ReviewReplyController(ReviewReplyService reviewReplyService) {
        this.reviewReplyService = reviewReplyService;
    }

    @PostMapping("/{review-id}")
    @PreAuthorize("hasAuthority('REVIEW_REPLY')")
    public ResponseEntity<ReviewReplyDto> replyReview(Principal currentUser, @PathVariable("review-id") Long reviewId, @RequestBody ReviewReplyRequest reviewReplyRequest) {
        return new ResponseEntity<>(reviewReplyService.createReviewReply(currentUser, reviewId, reviewReplyRequest), HttpStatus.CREATED);
    }

    @PutMapping("/{review-reply-id}")
    @PreAuthorize("hasAuthority('REVIEW_REPLY')")
    public ResponseEntity<ReviewReplyDto> updateReplyReview(Principal currentUser, @PathVariable("review-reply-id") Long reviewReplyId, @RequestBody ReviewReplyRequest reviewReplyRequest) {
        return new ResponseEntity<>(reviewReplyService.updateReviewReply(currentUser, reviewReplyId, reviewReplyRequest), HttpStatus.OK);
    }

    @DeleteMapping("/{review-reply-id}")
    @PreAuthorize("hasAuthority('REVIEW_REPLY')")
    public ResponseEntity<String> deleteReplyReview(Principal currentUser, @PathVariable("review-reply-id") Long reviewReplyId) {
        return new ResponseEntity<>(reviewReplyService.deleteReviewReply(currentUser, reviewReplyId), HttpStatus.NO_CONTENT);
    }



}
