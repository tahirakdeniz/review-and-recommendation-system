package com.rrss.backend.model

import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator

@Entity
@Table(name = "community_moderators")
data class CommunityModerator @JvmOverloads constructor(
    @Id
    @UuidGenerator
    val id: String? = "",

    @OneToOne
    @JoinColumn(name = "user_id")
    val user: User
)
