package com.rrss.backend.model

import jakarta.persistence.*

@Entity
@Table(name = "product_categories")
data class ProductCategory(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: Long? = null,

    @Column(unique = true)
    val name: String,

    val description: String
)
