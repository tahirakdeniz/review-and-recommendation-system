package com.rrss.backend.model

import com.rrss.backend.enums.MerchantRequestStatus
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "merchant_requests")
data class MerchantRequest @JvmOverloads constructor(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    val user: User,

    @Column(nullable = false)
    val requestDate: LocalDateTime = LocalDateTime.now(),

    val answeredDate: LocalDateTime? = null,

    @Column(nullable = true)
    var adminComment: String? = null, // Optional comment by the admin on approval or rejection

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: MerchantRequestStatus = MerchantRequestStatus.PENDING // PENDING, APPROVED, REJECTED
)