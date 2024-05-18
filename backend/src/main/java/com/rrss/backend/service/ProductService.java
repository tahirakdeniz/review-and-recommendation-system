package com.rrss.backend.service;

import com.rrss.backend.controller.ProductCategoryController;
import com.rrss.backend.dto.AddProductRequest;
import com.rrss.backend.dto.ProductDto;
import com.rrss.backend.dto.UpdateProductRequest;
import com.rrss.backend.exception.custom.ImageProcessingException;
import com.rrss.backend.exception.custom.PermissionDeniedException;
import com.rrss.backend.exception.custom.ProductCategoryNotFoundException;
import com.rrss.backend.exception.custom.ProductNotFoundException;
import com.rrss.backend.model.Merchant;
import com.rrss.backend.model.Product;
import com.rrss.backend.model.User;
import com.rrss.backend.repository.MerchantRepository;
import com.rrss.backend.repository.ProductCategoryRepository;
import com.rrss.backend.repository.ProductRepository;
import com.rrss.backend.util.ImageUtil;
import com.rrss.backend.util.UserUtil;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.zip.DataFormatException;

@Service
public class ProductService {

    private final ProductRepository repository;
    private final ProductCategoryService productCategoryService;
    private final UserUtil userUtil;
    private final ProductCategoryRepository productCategoryRepository;
    private final MerchantRepository merchantRepository;
    private final ProductCategoryController productCategoryController;
    private final ProductRepository productRepository;

    public ProductService(ProductRepository repository, ProductCategoryService productCategoryService, UserUtil userUtil, ProductCategoryRepository productCategoryRepository, MerchantRepository merchantRepository, ProductCategoryController productCategoryController, ProductRepository productRepository) {
        this.repository = repository;
        this.productCategoryService = productCategoryService;
        this.userUtil = userUtil;
        this.productCategoryRepository = productCategoryRepository;
        this.merchantRepository = merchantRepository;
        this.productCategoryController = productCategoryController;
        this.productRepository = productRepository;
    }

    public ProductDto addProduct(Principal currentUser, AddProductRequest addProductRequest, MultipartFile file) throws IOException {

        User user = userUtil.extractUser(currentUser);

        Product product = new Product(
                addProductRequest.name(),
                addProductRequest.description(),
                user.getMerchant(),
                productCategoryRepository.findByName(addProductRequest.productCategoryName())
                        .orElseThrow(() -> new ProductCategoryNotFoundException("no such category")),
                addProductRequest.price(),
                ImageUtil.compressImage(file.getBytes())
        );

        return ProductDto.convert(repository.save(product));
    }

    @Transactional
    public ProductDto deleteProduct(Principal currentUser, Long productId) {
        Product product = repository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        Merchant merchant = userUtil.extractUser(currentUser).getMerchant();

        if (merchant == null || !Objects.equals(merchant.getId(), product.getMerchant().getId())) {
            throw new PermissionDeniedException("you are not the owner of this product");
        }

        List<Product> products = merchant.getProducts();

        products.removeIf(e -> Objects.equals(e.getId(), productId));

        merchantRepository.save(new Merchant(
                merchant.getId(),
                merchant.getUser(),
                merchant.getReviewReplies(),
                products
        ));

        repository.delete(product);
        return ProductDto.convert(product);
    }

    public ProductDto getProduct(Long productId) {
        return ProductDto.convert(repository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found")));
    }


    public byte[] downloadProductPicture(Long productId) {
        Product product = repository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        try {
            return ImageUtil.decompressImage(product.getPicture());
        } catch (DataFormatException | IOException e) {
            throw new ImageProcessingException("change this....");
        }

    }

    public List<ProductDto> getAllProducts() {
        return repository
                .findAll()
                .stream()
                .map(ProductDto::convert)
                .toList();
    }

    public List<ProductDto> getProductsByCategory(String categoryName) {
        return repository
                .findByProductCategoryName(categoryName)
                .stream()
                .map(ProductDto::convert)
                .toList();
    }

    public ProductDto updateProduct(Principal currentUser, Long productId, UpdateProductRequest updateProductRequest) {
        Product product = repository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        User user = userUtil.extractUser(currentUser);
        if (user.getMerchant() == null || !Objects.equals(user.getMerchant().getId(), product.getMerchant().getId())) {
            throw new PermissionDeniedException("you are not the owner of this product");
        }

        Product newProduct = new Product(
                product.getId(),
                updateProductRequest.name(),
                updateProductRequest.description(),
                user.getMerchant(),
                productCategoryService.findByName(updateProductRequest.productCategoryName()),
                updateProductRequest.price(),
                product.getPicture()
        );

        return ProductDto.convert(repository.save(newProduct));
    }

    public List<ProductDto> getProductsByUser(Principal currentUser) {
        User user = userUtil.extractUser(currentUser);

        return user
                .getMerchant()
                .getProducts()
                .stream()
                .map(ProductDto::convert)
                .toList();
    }

    public ProductDto addProductInfo(Principal currentUser, AddProductRequest addProductRequest) {
        User user = userUtil.extractUser(currentUser);

        Product product = new Product(
                addProductRequest.name(),
                addProductRequest.description(),
                user.getMerchant(),
                productCategoryService.findByName(addProductRequest.productCategoryName()),
                addProductRequest.price(),
                null
        );

        return ProductDto.convert(repository.save(product));
    }

    public ProductDto addProductImage(Principal currentUser, long productId, MultipartFile file) throws IOException {
        User user = userUtil.extractUser(currentUser);

        Product oldProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        Product product = new Product(
                oldProduct.getId(),
                oldProduct.getName(),
                oldProduct.getDescription(),
                user.getMerchant(),
                oldProduct.getProductCategory(),
                oldProduct.getPrice(),
                ImageUtil.compressImage(file.getBytes())
        );

        return ProductDto.convert(repository.save(product));
    }

    public ProductDto addProductParam(Principal currentUser, String name, String description,  long categoryId,  BigDecimal price, MultipartFile file) throws IOException {
        User user = userUtil.extractUser(currentUser);

        Product product = new Product(
                name,
                description,
                user.getMerchant(),
                productCategoryRepository.findById(categoryId)
                        .orElseThrow(() -> new ProductCategoryNotFoundException("no such category")),
                price,
                ImageUtil.compressImage(file.getBytes())
        );

        return ProductDto.convert(repository.save(product));

    }

    public List<ProductDto> getAllProducts(String searchKey) {
        if (searchKey.isEmpty() || searchKey.isBlank())
            return getAllProducts();

        return repository
                .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(searchKey, searchKey)
                .stream()
                .map(ProductDto::convert)
                .toList();


    }
}
