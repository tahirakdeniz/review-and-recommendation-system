package com.rrss.backend.exception.custom;

public class WrongOtpException extends RuntimeException {
    public WrongOtpException(String message) {
        super(message);
    }
}