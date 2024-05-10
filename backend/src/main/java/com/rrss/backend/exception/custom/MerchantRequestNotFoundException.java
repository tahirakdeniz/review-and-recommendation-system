package com.rrss.backend.exception.custom;

public class MerchantRequestNotFoundException extends RuntimeException {
    public MerchantRequestNotFoundException(String message) {
        super(message);
    }
}