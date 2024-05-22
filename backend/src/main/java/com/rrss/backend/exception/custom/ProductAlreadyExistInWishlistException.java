package com.rrss.backend.exception.custom;

public class ProductAlreadyExistInWishlistException extends RuntimeException {
    public ProductAlreadyExistInWishlistException(String message) {
        super(message);
    }
}