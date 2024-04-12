package com.rrss.backend.model

import jakarta.persistence.*
import java.math.BigDecimal

@Entity
@Table(name = "social_credit_configs")
data class SocialCreditConfig(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, unique = true)
    val activityType: String, // Corresponds to activityType in SocialCreditActivity

    @Column(nullable = false)
    var creditPerActivity: BigDecimal
)

