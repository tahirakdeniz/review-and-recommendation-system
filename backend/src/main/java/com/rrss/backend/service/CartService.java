package com.rrss.backend.service;

import com.rrss.backend.model.Cart;
import com.rrss.backend.repository.CartRepository;
import org.springframework.stereotype.Service;

@Service
public class CartService {
    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    protected Cart createCart() {
        return cartRepository.save(new Cart());
    }
}
