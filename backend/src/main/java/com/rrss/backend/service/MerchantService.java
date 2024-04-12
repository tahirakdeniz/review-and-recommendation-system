package com.rrss.backend.service;

import com.rrss.backend.dto.AddProductRequest;
import com.rrss.backend.dto.ProductDto;
import com.rrss.backend.model.Merchant;
import com.rrss.backend.model.Product;
import com.rrss.backend.model.User;
import com.rrss.backend.repository.MerchantRepository;
import com.rrss.backend.util.ImageUtil;
import com.rrss.backend.util.UserUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.zip.DataFormatException;

@Service
public class MerchantService {

    private final MerchantRepository repository;
    private final UserUtil userUtil;
    private final ProductService productService;

    public MerchantService(MerchantRepository repository, UserUtil userUtil, ProductService productService) {
        this.repository = repository;
        this.userUtil = userUtil;
        this.productService = productService;
    }

    protected Merchant createMerchant(User user) {
        return repository.save(new Merchant(user));
    }

    public ProductDto addProduct(Principal currentUser, AddProductRequest addProductRequest, MultipartFile file) throws IOException {
        Merchant merchant = userUtil.extractUser(currentUser).getMerchant();
        return productService.addProduct(merchant, addProductRequest, file);
    }
}
