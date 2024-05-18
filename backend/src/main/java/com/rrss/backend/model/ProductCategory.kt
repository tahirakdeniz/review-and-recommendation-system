package com.rrss.backend.model

import jakarta.persistence.*

@Entity
@Table(name = "product_categories")
data class ProductCategory @JvmOverloads constructor(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: Long? = null,

    @Column(unique = true)
    val name: String,

    val description: String,

    @OneToMany(mappedBy = "productCategory", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.EAGER)
    val products: List<Product> = mutableListOf()
)