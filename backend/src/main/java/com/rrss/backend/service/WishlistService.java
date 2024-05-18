package com.rrss.backend.service;

import com.rrss.backend.dto.AddProductToWishlistRequest;
import com.rrss.backend.dto.RemoveProductFromWishlist;
import com.rrss.backend.dto.WishListItemDto;
import com.rrss.backend.dto.WishlistDto;
import com.rrss.backend.exception.custom.PermissionDeniedException;
import com.rrss.backend.exception.custom.ProductNotFoundException;
import com.rrss.backend.model.User;
import com.rrss.backend.model.Wishlist;
import com.rrss.backend.model.WishlistItem;
import com.rrss.backend.repository.ProductRepository;
import com.rrss.backend.repository.WishlistItemRepository;
import com.rrss.backend.repository.WishlistRepository;
import com.rrss.backend.util.UserUtil;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
public class WishlistService {

    private final WishlistRepository repository;
    private final UserUtil userUtil;
    private final ProductRepository productRepository;
    private final WishlistItemRepository wishlistItemRepository;

    public WishlistService(WishlistRepository repository, UserUtil userUtil, ProductRepository productRepository, WishlistItemRepository wishlistItemRepository) {
        this.repository = repository;
        this.userUtil = userUtil;
        this.productRepository = productRepository;
        this.wishlistItemRepository = wishlistItemRepository;
    }


    public WishlistDto getWishlist(Principal currentUser) {
        User user = userUtil.extractUser(currentUser);
        Wishlist wishlist = user.getWishlist();
        return WishlistDto.convert(wishlist);
    }


    public WishListItemDto addProductToWishlist(Principal currentUser, AddProductToWishlistRequest addProductToWishlistRequest) {
        Wishlist wishlist = userUtil.extractUser(currentUser).getWishlist();

        for(WishlistItem ele: wishlist.getItems()) {
            if (ele.getProduct().getId().equals(addProductToWishlistRequest.productId()))
                throw new PermissionDeniedException("Product already in wishlist");
        }

        WishlistItem wishlistItem = new WishlistItem(
                wishlist,
                productRepository.findById(addProductToWishlistRequest.productId())
                        .orElseThrow(() -> new ProductNotFoundException("product not found"))
        );

        return WishListItemDto.convert(wishlistItemRepository.save(wishlistItem));
    }

    public String removeProductFromWishlist(Principal currentUser, RemoveProductFromWishlist removeProductFromWishlist) {
        User user = userUtil.extractUser(currentUser);
        Wishlist wishlist = user.getWishlist();

        boolean flag = false;
        for(WishlistItem ele: wishlist.getItems()) {
            if (ele.getProduct().getId().equals(removeProductFromWishlist.id())) {
                wishlistItemRepository.delete(ele);
                flag = true;
            }
        }

        if (!flag) {
            throw new PermissionDeniedException("Product not in your wishlist");
        }

        return "Product successfully deleted in your wishlist";
    }
}
