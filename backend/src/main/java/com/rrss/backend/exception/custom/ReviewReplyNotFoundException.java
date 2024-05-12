package com.rrss.backend.exception.custom;

public class ReviewReplyNotFoundException extends RuntimeException {
    public ReviewReplyNotFoundException(String message) {
        super(message);
    }
}

