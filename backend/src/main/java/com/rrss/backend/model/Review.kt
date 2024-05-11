package com.rrss.backend.model

import jakarta.persistence.*

@Entity
@Table(name = "reviews")
data class Review @JvmOverloads constructor(

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: Long? = null,

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    val product: Product, // TODO PURCHASE OLABILIR

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @OneToMany(mappedBy = "review", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val scores: List<FieldScore> = mutableListOf(),

    @OneToOne
    val reply: ReviewReply,

    val comment: String
)

