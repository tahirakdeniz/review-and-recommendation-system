package com.rrss.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "wishlist_items")
data class WishlistItem @JvmOverloads constructor(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wishlist_id", nullable = false)
    val wishlist: Wishlist,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    val product: Product,

    // Additional fields as needed, e.g., addedOn, notes, etc.
    @Column(nullable = false)
    val addedOn: LocalDateTime = LocalDateTime.now()
)
