package com.rrss.backend.model

import jakarta.persistence.*

@Entity
@Table(name = "carts")
data class Cart(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @OneToOne(mappedBy = "cart", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val user: User,

    @OneToMany(mappedBy = "cart", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val items: List<CartItem> = mutableListOf()
)
