package com.rrss.backend.model

import jakarta.persistence.*
import java.io.Serializable

@Entity
@Table(name = "field_scores")
data class FieldScore(
    @EmbeddedId
    val id: FieldScoreId? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("reviewId")
    @JoinColumn(name = "user_review_id")
    val review: Review,

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("reviewFieldId")
    @JoinColumn(name = "review_form_attribute_id")
    val reviewField: ReviewField,

    @Column(nullable = false)
    val score: Int
)
