package com.rrss.backend.model

import com.rrss.backend.enums.ForumCategoryHeader
import jakarta.persistence.*

@Entity
@Table(name = "forum_categories")
data class ForumCategory @JvmOverloads constructor(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, unique = true)
    val name: String,

    @Column(nullable = false)
    val description: String,

    @OneToMany(mappedBy = "category", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val topics: List<Topic> = mutableListOf(),

    @Enumerated(EnumType.STRING)
    var header: ForumCategoryHeader
)
