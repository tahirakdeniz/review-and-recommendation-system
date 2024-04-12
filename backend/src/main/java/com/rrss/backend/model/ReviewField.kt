package com.rrss.backend.model

import jakarta.persistence.*

@Entity
@Table(name = "review_fields")
data class ReviewField @JvmOverloads constructor(

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: Long? = null,

    val Label: String,

    val minScore: Int = 1,
    val maxScore: Int = 10,
)
