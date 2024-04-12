package com.rrss.backend.model

import jakarta.persistence.*
import java.math.BigDecimal


// SATIN ALMA GECMISI ILE ALAKALI GENE IADE FALANDA LAZIM OLUR SILINEBILIR
@Entity
@Table(name = "purchase_items")
data class PurchaseItem(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    val product: Product,

    @Column(nullable = false)
    val priceAtPurchase: BigDecimal,

    @Column(nullable = false)
    val quantity: Int = 1
)
