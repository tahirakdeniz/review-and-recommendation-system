package com.rrss.backend.model

import jakarta.persistence.*
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction

@Entity
@Table(name = "review_forms")
data class ReviewForm @JvmOverloads constructor(

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: Long? = null,

    @OneToOne
    @JoinColumn(name = "product_type_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    val productType: ProductCategory,

    //@OneToMany(mappedBy = "reviewForm", cascade = [CascadeType.ALL], orphanRemoval = true)
    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    val fields: List<ReviewField> = mutableListOf(),

    )
