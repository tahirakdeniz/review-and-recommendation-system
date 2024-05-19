package com.rrss.backend.model

import jakarta.persistence.*

@Entity
@Table(name = "wishlists")
data class Wishlist(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @OneToMany(mappedBy = "wishlist", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    val items: List<WishlistItem> = mutableListOf()
)
