package com.rrss.backend.exception.custom;

public class OtpTokenNotFoundException extends RuntimeException {
    public OtpTokenNotFoundException(String message) {
        super(message);
    }
}