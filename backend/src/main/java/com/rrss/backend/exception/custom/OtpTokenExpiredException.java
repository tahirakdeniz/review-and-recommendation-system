package com.rrss.backend.exception.custom;

public class OtpTokenExpiredException extends RuntimeException {
    public OtpTokenExpiredException(String message) {
        super(message);
    }
}