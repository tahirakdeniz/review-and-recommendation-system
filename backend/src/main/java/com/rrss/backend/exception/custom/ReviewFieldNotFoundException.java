package com.rrss.backend.exception.custom;

public class ReviewFieldNotFoundException extends RuntimeException {
    public ReviewFieldNotFoundException(String message) {
        super(message);
    }
}