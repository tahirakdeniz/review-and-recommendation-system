package com.rrss.backend.model

import jakarta.persistence.*
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import org.hibernate.annotations.UuidGenerator

@Entity
@Table(name = "admins")
data class Admin @JvmOverloads constructor(

    @Id
    @UuidGenerator
    val id: String? = "",

    @OneToOne
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE) //todo BAK BAK BAK BAK
    val user: User,
    )
