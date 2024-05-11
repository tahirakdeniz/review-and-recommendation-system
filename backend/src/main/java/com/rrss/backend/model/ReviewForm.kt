package com.rrss.backend.model

import jakarta.persistence.*

@Entity
@Table(name = "review_forms")
data class ReviewForm @JvmOverloads constructor(

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: Long? = null,

    @OneToOne
    @JoinColumn(name = "product_type_id", nullable = false)
    val productType: ProductCategory,
    //TODO ONE TO MANY OR ONE TO ONE

    @OneToMany
    val fields: List<ReviewField> = mutableListOf(),

    )
