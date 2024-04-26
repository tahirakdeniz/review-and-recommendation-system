package com.rrss.backend.service;

import com.rrss.backend.dto.*;
import com.rrss.backend.model.*;
import com.rrss.backend.repository.*;
import com.rrss.backend.util.UserUtil;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CartService {
    private final CartRepository repository;
    private final UserUtil userUtil;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final PurchaseRepository purchaseRepository;
    private final PurchaseItemRepository purchaseItemRepository;
    private final UserRepository userRepository;


    public CartService(CartRepository repository, UserUtil userUtil, CartItemRepository cartItemRepository, ProductRepository productRepository, PurchaseRepository purchaseRepository, PurchaseItemRepository purchaseItemRepository, UserRepository userRepository) {
        this.repository = repository;
        this.userUtil = userUtil;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.purchaseRepository = purchaseRepository;
        this.purchaseItemRepository = purchaseItemRepository;
        this.userRepository = userRepository;
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
        Cart cart = userUtil.extractUser(currentUser).getCart();

        return cart
                .getItems()
                .stream()
                .filter(item -> Objects.equals(item.getProduct().getId(), request.productId()))
                .findFirst()
                .map(cartItem -> updateOrRemoveItem(cart, cartItem))
                .orElse("Product not found in cart");
    }

    private String updateOrRemoveItem(Cart cart, CartItem item) {
        if (item.getQuantity() > 1) {
            CartItem updatedItem = new CartItem(item.getId(), item.getCart(), item.getProduct(), item.getQuantity() - 1);
            cartItemRepository.save(updatedItem);
        } else {
            cart.getItems().removeIf(e -> Objects.equals(e.getId() , item.getId()));
            repository.save(cart); // TODO CART I NEWLEMEK GEREKEBILIR
            cartItemRepository.delete(item);
        }
        return "Product removed from cart"; //TODO RETURN DELETED ITEM
    }

    @Transactional
    public UserPurchaseDto buyItemsInCart(Principal currentUser) {
        User user = userUtil.extractUser(currentUser);
        Cart cart = user.getCart();


        List<PurchaseItem> purchaseItems = cart.getItems()
                .stream()
                .map(this::processCartItem)
                .collect(Collectors.toList());

        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        repository.save(cart);

        BigDecimal totalCost = purchaseItems.stream()
                .map(purchaseItem -> purchaseItem.getProduct().getPrice().multiply(BigDecimal.valueOf(purchaseItem.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (user.getAccountBalance().compareTo(totalCost) < 0) {
            throw new RuntimeException("cant buy the product");
        }

        BigDecimal newAccountBalance = user.getAccountBalance().subtract(totalCost);
        userRepository.save(new User(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getDescription(),
                user.isEnabled(),
                user.isCredentialsNonExpired(),
                user.isAccountNonExpired(),
                user.isAccountNonLocked(),
                user.getFirstName(),
                user.getLastName(),
                user.getProfilePicture(),
                user.getRole(),
                user.getDateOfBirth(),
                user.getMerchant(),
                user.getReviews(),
                newAccountBalance,
                user.getCart(),
                user.getSocialCredit(),
                user.getPurchases()
        ));

        Purchase purchase = new Purchase(null, user, purchaseItems, totalCost, LocalDateTime.now());
        return UserPurchaseDto.convert(purchaseRepository.save(purchase));
    }

    private PurchaseItem processCartItem(CartItem item) {
        Product product = item.getProduct();
        PurchaseItem purchaseItem = new PurchaseItem(null, product, product.getPrice(), item.getQuantity());
        purchaseItem = purchaseItemRepository.save(purchaseItem);


        return purchaseItem;
    }

    public CartDto getCart(Principal currentUser) {
        User user = userUtil.extractUser(currentUser);
        Cart cart = user.getCart();

        return CartDto.convert(cart);
    }
}
