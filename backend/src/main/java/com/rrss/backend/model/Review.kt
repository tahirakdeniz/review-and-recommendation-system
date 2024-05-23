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
    val product: Product,

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @OneToMany(mappedBy = "review", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.EAGER)
    val scores: List<FieldScore> = mutableListOf(),

    @OneToOne
    val reply: ReviewReply? = null,

    val comment: String,

    val isDeleted: Boolean = false
)

