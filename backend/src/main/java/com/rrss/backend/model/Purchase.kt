package com.rrss.backend.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime


//SATIN ALMA GECMISI YAPACAKSAK LAZIM EGER YAPMAYACAKSAK GEREK YOK
@Entity
@Table(name = "purchases")
data class Purchase(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_id")
    val items: List<PurchaseItem> = mutableListOf(),

    @Column(nullable = false)
    val totalCost: BigDecimal = BigDecimal.ZERO,

    @Column(nullable = false)
    val purchaseDate: LocalDateTime = LocalDateTime.now()
)

