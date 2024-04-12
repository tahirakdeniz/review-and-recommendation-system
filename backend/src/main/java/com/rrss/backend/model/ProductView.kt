package com.rrss.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "product_views")
data class ProductView(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    val product: Product,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @Column(nullable = false)
    val viewDate: LocalDateTime = LocalDateTime.now()
)

