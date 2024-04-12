package com.rrss.backend.model

import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import java.sql.Types

@Entity
@Table(name = "products")
data class Product @JvmOverloads constructor(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: Long? = null,

    val name: String,

    val description: String,

    @ManyToOne
    @JoinColumn(name = "merchant_id")
    val merchant: Merchant,

    @ManyToOne
    @JoinColumn(name = "product_type_id", nullable = false)
    val productCategory: ProductCategory,

    val price: Double,

    @Lob
    @JdbcTypeCode(Types.LONGVARBINARY)
    val picture: ByteArray,


) {

}
