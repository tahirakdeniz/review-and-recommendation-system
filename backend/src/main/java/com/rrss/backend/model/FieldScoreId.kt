package com.rrss.backend.model

import jakarta.persistence.Embeddable
import java.io.Serializable

@Embeddable
data class FieldScoreId(
    val reviewId: Long = 0,
    val reviewFieldId: Long = 0
) : Serializable
