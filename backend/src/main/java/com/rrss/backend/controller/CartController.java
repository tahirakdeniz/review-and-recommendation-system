package com.rrss.backend.controller;

import com.rrss.backend.dto.*;
import com.rrss.backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PutMapping("/add-product")
    public ResponseEntity<CartItemDto> addProductToCart(Principal currentUser, @RequestBody AddProductToCartRequest addProductToCartRequest) {
        return ResponseEntity.ok(cartService.addProductToCart(currentUser, addProductToCartRequest));
    }

    @PutMapping("/remove-product")
    public ResponseEntity<String> removeProductFromCart(Principal currentUser, @RequestBody RemoveProductFromCartRequest removeProductFromCartRequest) {
        return ResponseEntity.ok(cartService.removeProductFromCart(currentUser, removeProductFromCartRequest));
    }

    @PostMapping
    public ResponseEntity<UserPurchaseDto> buyItemsInCart(Principal currentUser) {
        return ResponseEntity.ok(cartService.buyItemsInCart(currentUser));
    }
}
