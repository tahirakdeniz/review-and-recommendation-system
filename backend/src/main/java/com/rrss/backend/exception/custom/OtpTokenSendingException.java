package com.rrss.backend.exception.custom;

public class OtpTokenSendingException extends RuntimeException {
    public OtpTokenSendingException(String message) {
        super(message);
    }
}