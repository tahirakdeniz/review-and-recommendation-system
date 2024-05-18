package com.rrss.backend.exception.custom;

public class ProductCategoryAlreadyExistException extends RuntimeException {
    public ProductCategoryAlreadyExistException(String message) {
        super(message);
    }
}