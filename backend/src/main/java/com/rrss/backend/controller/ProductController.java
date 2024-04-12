package com.rrss.backend.controller;
import com.rrss.backend.dto.AddProductRequest;
import com.rrss.backend.dto.ProductDto;
import com.rrss.backend.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

import static org.springframework.util.MimeTypeUtils.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @PreAuthorize("hasRole('MERCHANT')")
    public ResponseEntity<ProductDto> addProduct(Principal currentUser, @RequestBody AddProductRequest addProductRequest, @RequestParam("image") MultipartFile file) throws IOException {
        return new ResponseEntity<>(productService.addProduct(currentUser, addProductRequest, file), HttpStatus.CREATED);
    }

    @DeleteMapping("/{productId}")
    @PreAuthorize("hasRole('MERCHANT')")
    public ResponseEntity<String> deleteProduct(Principal currentUser, @PathVariable Long productId) {
        return new ResponseEntity<>(productService.deleteProduct(currentUser, productId), HttpStatus.NO_CONTENT);
    }


    //TODO THIS AND BELOW ENDPOINTS CAN BE MERGE.
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(productService.getProduct(productId));
    }

    @GetMapping("/{productId}/picture")
    public ResponseEntity<byte[]> downloadProductPicture(@PathVariable Long productId) {
        byte[] imageData = productService.downloadProductPicture(productId);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf(IMAGE_PNG_VALUE))
                .body(imageData);
    }
}
