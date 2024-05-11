package com.rrss.backend.exception.custom;

public class ReviewFormNotFoundException extends RuntimeException {
    public ReviewFormNotFoundException(String message) {
        super(message);
    }
}
