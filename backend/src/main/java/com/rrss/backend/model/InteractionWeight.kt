package com.rrss.backend.model

import com.rrss.backend.enums.InteractionWeightType
import jakarta.persistence.*

@Entity
@Table(name = "interaction_weights")
data class InteractionWeight @JvmOverloads constructor(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = 0,

    @Column(nullable = false, unique = true)
    val interactionType: InteractionWeightType, // E.g., "Purchase", "Review", "View"

    @Column(nullable = false)
    var weight: Int // This can be updated by the administrator
)
