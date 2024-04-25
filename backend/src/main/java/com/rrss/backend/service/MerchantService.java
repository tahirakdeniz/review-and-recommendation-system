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
import java.util.List;
import java.util.zip.DataFormatException;

@Service
public class MerchantService {

    private final MerchantRepository repository;

    public MerchantService(MerchantRepository repository) {
        this.repository = repository;
    }

    protected Merchant createMerchant(User user) {
        return repository.save(new Merchant(user));
    }
}
