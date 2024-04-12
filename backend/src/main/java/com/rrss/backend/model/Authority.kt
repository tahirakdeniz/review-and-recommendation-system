package com.rrss.backend.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.security.core.GrantedAuthority


@Entity
@Table(name = "authorities")
data class Authority (

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: Long,

    val name: String

) : GrantedAuthority {
    override fun getAuthority(): String {
        return name
    }
}
