package com.rrss.backend.model

import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator

@Entity
@Table(name = "merchants")
data class Merchant @JvmOverloads constructor(
    @Id
    @UuidGenerator
    val id: String? = "",

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    val user: User,

    @OneToMany(mappedBy = "merchant", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val reviewReplies: List<ReviewReply> = mutableListOf(),

    @OneToMany(mappedBy = "merchant", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    val products: List<Product> = mutableListOf()

) {

}
