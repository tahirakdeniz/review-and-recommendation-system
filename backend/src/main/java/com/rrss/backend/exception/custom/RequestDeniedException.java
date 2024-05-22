package com.rrss.backend.exception.custom;

public class RequestDeniedException extends RuntimeException{
    public RequestDeniedException(String message) {
        super(message);
    }
}