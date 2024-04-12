package com.rrss.backend.model

import jakarta.persistence.*

@Entity
@Table(name = "forum_categories")
data class ForumCategory(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val name: String,

    @Column(nullable = false)
    val description: String,

    @OneToMany(mappedBy = "category", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val topics: List<Topic> = mutableListOf()
)
