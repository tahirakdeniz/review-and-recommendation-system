package com.rrss.backend.controller;


import com.rrss.backend.dto.AddProductRequest;
import com.rrss.backend.dto.ProductDto;
import com.rrss.backend.service.MerchantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/merchants")
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantController {

    private final MerchantService merchantService;

    public MerchantController(MerchantService merchantService) {
        this.merchantService = merchantService;
    }

    public ResponseEntity<ProductDto> addProduct(Principal currentUser, @RequestBody AddProductRequest addProductRequest, @RequestParam("image") MultipartFile file) throws IOException {
        return new ResponseEntity<>(merchantService.addProduct(currentUser, addProductRequest, file), HttpStatus.CREATED);
    }
}
