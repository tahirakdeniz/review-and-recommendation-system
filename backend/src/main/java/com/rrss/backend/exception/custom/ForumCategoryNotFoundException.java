package com.rrss.backend.exception.custom;

public class ForumCategoryNotFoundException extends RuntimeException {
    public ForumCategoryNotFoundException(String message) {
        super(message);
    }
}
