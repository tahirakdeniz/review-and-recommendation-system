package com.rrss.backend.model

import jakarta.persistence.*
import org.springframework.security.core.GrantedAuthority


@Entity
@Table(name = "roles")
data class Role @JvmOverloads constructor(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: Long? = null,

    val name: String,

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "role_permissions",
        joinColumns = [JoinColumn(name = "role_id")],
        inverseJoinColumns = [JoinColumn(name = "permission_id")]
    )
    val authorities: Set<Authority> = mutableSetOf()
)