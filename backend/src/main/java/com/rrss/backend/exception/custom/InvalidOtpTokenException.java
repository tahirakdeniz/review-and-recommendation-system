package com.rrss.backend.exception.custom;

public class InvalidOtpTokenException extends RuntimeException {
    public InvalidOtpTokenException(String message) {
        super(message);
    }
}