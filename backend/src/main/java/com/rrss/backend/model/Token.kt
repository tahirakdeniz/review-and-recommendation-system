package com.rrss.backend.model

import com.rrss.backend.enums.TokenType
import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator

@Entity
@Table(name = "tokens")
data class Token @JvmOverloads constructor (

    @Id
    @UuidGenerator
    val id: String? = "",
    val token: String,
    @Enumerated(EnumType.STRING)
    val tokenType: TokenType,
    var expired: Boolean,
    var revoked: Boolean,
    @ManyToOne
    @JoinColumn(name = "user_id")
    val user: User

) {

}

