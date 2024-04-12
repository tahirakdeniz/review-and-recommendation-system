package com.rrss.backend.service;

import com.rrss.backend.dto.AddProductRequest;
import com.rrss.backend.dto.ProductDto;
import com.rrss.backend.model.Merchant;
import com.rrss.backend.model.Product;
import com.rrss.backend.repository.ProductRepository;
import com.rrss.backend.util.ImageUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@Service
public class ProductService {

    private final ProductRepository repository;
    private final ProductCategoryService productCategoryService;

    public ProductService(ProductRepository repository, ProductCategoryService productCategoryService) {
        this.repository = repository;
        this.productCategoryService = productCategoryService;
    }

    public ProductDto addProduct(Merchant merchant, AddProductRequest addProductRequest, MultipartFile file) throws IOException {
        Product product = new Product(
                addProductRequest.name(),
                addProductRequest.description(),
                merchant,
                productCategoryService.findByName(addProductRequest.productCategoryName()),
                addProductRequest.price(),
                ImageUtil.compressImage(file.getBytes())
        );

        return ProductDto.convert(repository.save(product));
    }
}
