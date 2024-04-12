package com.rrss.backend.service;

import com.rrss.backend.dto.AddProductRequest;
import com.rrss.backend.dto.ProductDto;
import com.rrss.backend.model.Merchant;
import com.rrss.backend.model.Product;
import com.rrss.backend.repository.ProductRepository;
import com.rrss.backend.util.ImageUtil;
import com.rrss.backend.util.UserUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.Objects;
import java.util.zip.DataFormatException;

@Service
public class ProductService {

    private final ProductRepository repository;
    private final ProductCategoryService productCategoryService;
    private final UserUtil userUtil;

    public ProductService(ProductRepository repository, ProductCategoryService productCategoryService, UserUtil userUtil) {
        this.repository = repository;
        this.productCategoryService = productCategoryService;
        this.userUtil = userUtil;
    }

    public ProductDto addProduct(Principal currentUser, AddProductRequest addProductRequest, MultipartFile file) throws IOException {

        Product product = new Product(
                addProductRequest.name(),
                addProductRequest.description(),
                Objects.requireNonNull(userUtil.extractUser(currentUser).getMerchant()),
                productCategoryService.findByName(addProductRequest.productCategoryName()),
                addProductRequest.price(),
                ImageUtil.compressImage(file.getBytes())
        );

        return ProductDto.convert(repository.save(product));
    }

    public String deleteProduct(Principal currentUser, Long productId) {
        Product product = repository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        repository.delete(product);

        return "Product deleted successfully";
    }

    public ProductDto getProduct(Long productId) {
        return ProductDto.convert(repository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found")));
    }


    public byte[] downloadProductPicture(Long productId) {
        Product product = repository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        try {
            return ImageUtil.decompressImage(product.getPicture());
        } catch (DataFormatException | IOException e) {
            throw new RuntimeException("change this....");
        }

    }
}
