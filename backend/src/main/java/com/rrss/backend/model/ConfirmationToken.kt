package com.rrss.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "confirmation_tokens")
data class ConfirmationToken @JvmOverloads constructor(

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: Long? = null,
    val otp: String,

    val email: String,
    val expirationTime: LocalDateTime
)
