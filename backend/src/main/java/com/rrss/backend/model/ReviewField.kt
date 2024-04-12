package com.rrss.backend.model

import jakarta.persistence.*

@Entity
@Table(name = "review_fields")
data class ReviewField(

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: Long? = null,

    val Label: String,

    val minScore: Int,
    val maxScore: Int,
)
