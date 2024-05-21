package com.rrss.backend.controller;
import com.rrss.backend.dto.AddProductRequest;
import com.rrss.backend.dto.ProductDto;
import com.rrss.backend.dto.UpdateProductRequest;
import com.rrss.backend.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;

import static org.springframework.util.MimeTypeUtils.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }


    //add product with info and picture
    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_PRODUCT')")
    public ResponseEntity<ProductDto> addProduct(Principal currentUser, @RequestPart AddProductRequest addProductRequest, @RequestParam("image") MultipartFile file) throws IOException {
        return new ResponseEntity<>(productService.addProduct(currentUser, addProductRequest, file), HttpStatus.CREATED);
    }

    //add product info
    @PostMapping("/info")
    @PreAuthorize("hasAuthority('MANAGE_PRODUCT')")
    public ResponseEntity<ProductDto> addProductInfo(Principal currentUser, @RequestBody AddProductRequest addProductRequest) throws IOException {
        return new ResponseEntity<>(productService.addProductInfo(currentUser, addProductRequest), HttpStatus.CREATED);
    }

    //add product image
    @PostMapping("/{productId}/image")
    @PreAuthorize("hasAuthority('MANAGE_PRODUCT')")
    public ResponseEntity<ProductDto> addProductPicture(Principal currentUser, @PathVariable long productId, @RequestParam("image") MultipartFile file) throws IOException {
        return new ResponseEntity<>(productService.addProductImage(currentUser, productId, file), HttpStatus.CREATED);
    }

    //add product with image but path variables.
    @PostMapping("/add")
    @PreAuthorize("hasAuthority('MANAGE_PRODUCT')")
    public ResponseEntity<ProductDto> addProductParam(Principal currentUser, @RequestParam String name, @RequestParam String description, @RequestParam long categoryId, @RequestParam BigDecimal price, @RequestParam("image") MultipartFile file) throws IOException {
        return new ResponseEntity<>(productService.addProductParam(currentUser, name, description, categoryId, price, file), HttpStatus.CREATED);
    }


    @PutMapping("/{productId}")
    @PreAuthorize("hasAuthority('MANAGE_PRODUCT')")
    public ResponseEntity<ProductDto> updateProduct(Principal currentUser, @PathVariable Long productId, @RequestBody UpdateProductRequest updateProductRequest) {
        return new ResponseEntity<>(productService.updateProduct(currentUser, productId, updateProductRequest), HttpStatus.OK);
    }

    //todo product fotografi update

    @DeleteMapping("/{productId}")
    @PreAuthorize("hasAuthority('MANAGE_PRODUCT')")
    public ResponseEntity<ProductDto> deleteProduct(Principal currentUser, @PathVariable Long productId) {
        return new ResponseEntity<>(productService.deleteProduct(currentUser, productId), HttpStatus.OK);
    }

    @GetMapping("/get/{productId}")
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

    @GetMapping("/get")
    public  ResponseEntity<List<ProductDto>> getAllProducts(@RequestParam(defaultValue = "") String searchKey) {
        return ResponseEntity.ok(productService.getAllProducts(searchKey));
    }

    @GetMapping("/category/{category-name}")
    public ResponseEntity<List<ProductDto>> getProductsByCategory(@PathVariable(name = "category-name") String categoryName) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryName));
    }

    @GetMapping("my-products")
    @PreAuthorize("hasAuthority('MANAGE_PRODUCT')")
    public ResponseEntity<List<ProductDto>> getProductsByUser(Principal currentUser) {
        return ResponseEntity.ok(productService.getProductsByUser(currentUser));
    }

}
