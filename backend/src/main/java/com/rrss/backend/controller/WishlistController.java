package com.rrss.backend.controller;

import com.rrss.backend.dto.AddProductToWishlistRequest;
import com.rrss.backend.dto.RemoveProductFromWishlist;
import com.rrss.backend.dto.WishListItemDto;
import com.rrss.backend.dto.WishlistDto;
import com.rrss.backend.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;


    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @DeleteMapping("delete-product")
    public ResponseEntity<String> removeProductFromWishlist(Principal currentUser, @RequestBody RemoveProductFromWishlist removeProductFromWishlist) {
        return ResponseEntity.ok(wishlistService.removeProductFromWishlist(currentUser,removeProductFromWishlist));
    }

    @PutMapping("add-product")
    public ResponseEntity<WishListItemDto> addProductToWishlist(Principal currentUser, @RequestBody AddProductToWishlistRequest addProductToWishlistRequest){
        return ResponseEntity.ok(wishlistService.addProductToWishlist(currentUser, addProductToWishlistRequest));
    }

    @GetMapping
    public ResponseEntity<WishlistDto> getWishlist(Principal currentUser) {
        return ResponseEntity.ok(wishlistService.getWishlist(currentUser));
    }

}
