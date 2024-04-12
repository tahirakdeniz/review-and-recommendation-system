package com.rrss.backend.model

import jakarta.persistence.*

@Entity
@Table(name = "interaction_weights")
data class InteractionWeight(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, unique = true)
    val interactionType: String, // E.g., "Purchase", "Review", "Search"

    @Column(nullable = false)
    var weight: Int // This can be updated by the administrator
)
