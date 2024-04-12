package com.rrss.backend.exception.custom;

public class UsernameIsNotUniqueException extends RuntimeException {
    public UsernameIsNotUniqueException(String message) {
        super(message);
    }
}