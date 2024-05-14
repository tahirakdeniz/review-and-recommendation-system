package com.rrss.backend.service;

import com.rrss.backend.dto.ProductCategoryDto;
import com.rrss.backend.dto.ProductCategoryRequest;
import com.rrss.backend.exception.custom.PermissionDeniedException;
import com.rrss.backend.exception.custom.ProductCategoryAlreadyExistException;
import com.rrss.backend.exception.custom.ProductCategoryNotFoundException;
import com.rrss.backend.model.ProductCategory;
import com.rrss.backend.repository.ProductCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductCategoryService {

    private final ProductCategoryRepository repository;

    public ProductCategoryService(ProductCategoryRepository repository) {
        this.repository = repository;
    }

    protected ProductCategory findByName(String name) {
        return repository.findByName(name)
                .orElseThrow(() -> new ProductCategoryNotFoundException("Product category not found."));
    }

    public List<ProductCategoryDto> getAllProductCategories() {
        return repository
                .findAll()
                .stream()
                .map(ProductCategoryDto::convert)
                .toList();
    }

    public ProductCategoryDto addProductCategory(ProductCategoryRequest productCategoryRequest) {
        if (repository.existsByName(productCategoryRequest.name()))
            throw new ProductCategoryAlreadyExistException("product category with this name already exists.");

        return ProductCategoryDto.convert(
                repository.save(
                        new ProductCategory(
                                productCategoryRequest.name(),
                                productCategoryRequest.description()
                        )
                )
        );
    }

    public ProductCategoryDto updateProductCategory(long id, ProductCategoryRequest productCategoryRequest) {
        if (!repository.existsById(id)) {
            throw new ProductCategoryNotFoundException("Product category not found");
        }

        if (repository.existsByName(productCategoryRequest.name()))
            throw new ProductCategoryAlreadyExistException("product category with this name already exists.");


        return ProductCategoryDto.convert(
                repository.save(
                        new ProductCategory(
                                id,
                                productCategoryRequest.name(),
                                productCategoryRequest.description()
                        )
                )
        );
    }

    public String deleteProductCategory(long id) {
        repository.deleteById(id);
        
        return "Deleted product category with id: " + id;
    }
}
