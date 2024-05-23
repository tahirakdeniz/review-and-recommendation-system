package com.rrss.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "review_replies")
data class ReviewReply @JvmOverloads constructor(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    val review: Review,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    val merchant: Merchant,

    @Column(nullable = false, columnDefinition = "TEXT")
    val content: String,

    @Column(nullable = false)
    val replyDate: LocalDateTime = LocalDateTime.now()
)
