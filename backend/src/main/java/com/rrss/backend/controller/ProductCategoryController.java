package com.rrss.backend.controller;

import com.rrss.backend.dto.ProductCategoryDto;
import com.rrss.backend.dto.ProductCategoryRequest;
import com.rrss.backend.service.ProductCategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/product-categories")
public class ProductCategoryController {

    private final ProductCategoryService productCategoryService;

    public ProductCategoryController(ProductCategoryService productCategoryService) {
        this.productCategoryService = productCategoryService;
    }

    @GetMapping("/get")
    public ResponseEntity<List<ProductCategoryDto>> getAllProductCategories() {
        return ResponseEntity.ok(productCategoryService.getAllProductCategories());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_PRODUCT_CATEGORY')")
    public ResponseEntity<ProductCategoryDto> addProductCategory(@RequestBody ProductCategoryRequest productCategoryRequest) {
        return ResponseEntity.ok(productCategoryService.addProductCategory(productCategoryRequest));
    }

    @PutMapping("/{product-category-id}")
    @PreAuthorize("hasAuthority('MANAGE_PRODUCT_CATEGORY')")
    public ResponseEntity<ProductCategoryDto> updateProductCategory(@PathVariable("product-category-id") long id, @RequestBody ProductCategoryRequest productCategoryRequest) {
        return ResponseEntity.ok(productCategoryService.updateProductCategory(id, productCategoryRequest));
    }

    @DeleteMapping("/{product-category-id}")
    @PreAuthorize("hasAuthority('MANAGE_PRODUCT_CATEGORY')")
    public ResponseEntity<String> deleteProductCategory(@PathVariable("product-category-id") long id) {
        return ResponseEntity.ok(productCategoryService.deleteProductCategory(id));
    }
}
