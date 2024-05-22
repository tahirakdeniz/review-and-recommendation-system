package com.rrss.backend.service;

import com.rrss.backend.dto.ProductCategoryDto;
import com.rrss.backend.dto.ProductCategoryRequest;
import com.rrss.backend.dto.ReviewFormRequest;
import com.rrss.backend.exception.custom.PermissionDeniedException;
import com.rrss.backend.exception.custom.ProductCategoryAlreadyExistException;
import com.rrss.backend.exception.custom.ProductCategoryNotFoundException;
import com.rrss.backend.model.ProductCategory;
import com.rrss.backend.model.ReviewForm;
import com.rrss.backend.repository.ProductCategoryRepository;
import com.rrss.backend.repository.ReviewFieldRepository;
import com.rrss.backend.repository.ReviewFormRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductCategoryService {

    private final ProductCategoryRepository repository;
    private final ReviewService reviewService;
    private final ReviewFieldRepository reviewFieldRepository;
    private final ReviewFormRepository reviewFormRepository;

    public ProductCategoryService(ProductCategoryRepository repository, ReviewService reviewService, ReviewFieldRepository reviewFieldRepository, ReviewFormRepository reviewFormRepository) {
        this.repository = repository;
        this.reviewService = reviewService;
        this.reviewFieldRepository = reviewFieldRepository;
        this.reviewFormRepository = reviewFormRepository;
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


        var prodCategory = repository.save(
                new ProductCategory(
                        productCategoryRequest.name(),
                        productCategoryRequest.description()
                )
        );
        reviewService.createReviewForm(new ReviewFormRequest(prodCategory.getName(), prodCategory.getName()));


        return ProductCategoryDto.convert(prodCategory);
    }

    public ProductCategoryDto updateProductCategory(long id, ProductCategoryRequest productCategoryRequest) {
        if (!repository.existsById(id)) {
            throw new ProductCategoryNotFoundException("Product category not found");
        }

        var prodCategory = repository.findByName(productCategoryRequest.name());
        if (prodCategory.isPresent() && prodCategory.get().getId() != id) {
            throw new ProductCategoryAlreadyExistException("product category with this name already exists.");
        }

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
        if (repository.existsWithAssignedProducts(id)) {
            throw new PermissionDeniedException("You can't delete this product category because there is a product in it.");
        }

        ReviewForm reviewForm = reviewFormRepository.findByProductTypeName(
                repository.findById(id)
                        .orElseThrow(() -> new PermissionDeniedException("form cant found"))
                        .getName()
        ).orElseThrow(() -> new ProductCategoryNotFoundException("product category not found."));

        if (reviewForm != null) {
            reviewFieldRepository.deleteAll(reviewForm.getFields());
            reviewFormRepository.delete(reviewForm);
        }

        repository.deleteById(id);
        return "Deleted product category with id: " + id;
    }
}
