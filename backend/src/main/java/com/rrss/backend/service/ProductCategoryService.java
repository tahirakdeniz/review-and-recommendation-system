package com.rrss.backend.service;

import com.rrss.backend.model.ProductCategory;
import com.rrss.backend.repository.ProductCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductCategoryService {

    private final ProductCategoryRepository repository;

    public ProductCategoryService(ProductCategoryRepository repository) {
        this.repository = repository;
    }

    protected ProductCategory findByName(String name) {
        return repository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Product category not found"));
    }
}
