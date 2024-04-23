package com.rrss.backend.service;

import com.rrss.backend.dto.*;
import com.rrss.backend.model.*;
import com.rrss.backend.repository.*;
import com.rrss.backend.util.UserUtil;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {
    private final CartRepository repository;
    private final UserUtil userUtil;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final PurchaseRepository purchaseRepository;
    private final PurchaseItemRepository purchaseItemRepository;


    public CartService(CartRepository repository, UserUtil userUtil, CartItemRepository cartItemRepository, ProductRepository productRepository, PurchaseRepository purchaseRepository, PurchaseItemRepository purchaseItemRepository) {
        this.repository = repository;
        this.userUtil = userUtil;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.purchaseRepository = purchaseRepository;
        this.purchaseItemRepository = purchaseItemRepository;
    }

    protected Cart createCart() {
        return repository.save(new Cart());
    }

    public CartItemDto addProductToCart(Principal currentUser, AddProductToCartRequest request) {
        Cart cart = userUtil.extractUser(currentUser).getCart();

        CartItem newCartItem = cart.getItems()
                .stream()
                .filter(item -> Objects.equals(item.getProduct().getId(), request.productId()))
                .findFirst()
                .map(item -> incrementQuantity(item, request.quantity()))
                .orElseGet(() -> createNewItem(cart, request));

        return CartItemDto.convert(cartItemRepository.save(newCartItem));
    }

    private CartItem incrementQuantity(CartItem item, int additionalQuantity) {
        return new CartItem(
                item.getId(),
                item.getCart(),
                item.getProduct(),
                item.getQuantity() + additionalQuantity
        );
    }

    private CartItem createNewItem(Cart cart, AddProductToCartRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return new CartItem(null, cart, product, request.quantity());
    }

    public String removeProductFromCart(Principal currentUser, RemoveProductFromCartRequest request) {
        return userUtil.extractUser(currentUser).getCart()
                .getItems()
                .stream()
                .filter(item -> Objects.equals(item.getProduct().getId(), request.productId()))
                .findFirst()
                .map(this::updateOrRemoveItem)
                .orElse("Product not found in cart");
    }

    private String updateOrRemoveItem(CartItem item) {
        if (item.getQuantity() > 1) {
            CartItem updatedItem = new CartItem(item.getId(), item.getCart(), item.getProduct(), item.getQuantity() - 1);
            cartItemRepository.save(updatedItem);
        } else {
            cartItemRepository.delete(item);
        }
        return "Product removed from cart";
    }

    public UserPurchaseDto buyItemsInCart(Principal currentUser) {
        User user = userUtil.extractUser(currentUser);
        Cart cart = user.getCart();

        List<PurchaseItem> purchaseItems = cart.getItems().stream()
                .map(this::processCartItem)
                .collect(Collectors.toList());

        BigDecimal totalCost = purchaseItems.stream()
                .map(purchaseItem -> purchaseItem.getProduct().getPrice().multiply(BigDecimal.valueOf(purchaseItem.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Purchase purchase = new Purchase(null, user, purchaseItems, totalCost, LocalDateTime.now());
        return UserPurchaseDto.convert(purchaseRepository.save(purchase));
    }

    private PurchaseItem processCartItem(CartItem item) {
        Product product = item.getProduct();
        PurchaseItem purchaseItem = new PurchaseItem(null, product, product.getPrice(), item.getQuantity());
        purchaseItem = purchaseItemRepository.save(purchaseItem);
        cartItemRepository.delete(item);
        return purchaseItem;
    }
}
