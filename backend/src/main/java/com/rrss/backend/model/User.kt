package com.rrss.backend.model

import jakarta.persistence.*
import jakarta.validation.constraints.Email
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.annotations.UuidGenerator
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.math.BigDecimal
import java.sql.Types
import java.time.LocalDate

@Entity
@Table(name = "users")
data class User @JvmOverloads constructor(
    @Id
    @UuidGenerator
    val id: String? = "",

    @Column(unique = true)
    private val username: String,

    private val password: String,
    @Email
    val email: String,

    val description: String? = null,

    private val isEnabled: Boolean = true,
    private val isCredentialsNonExpired: Boolean = true,
    private val isAccountNonExpired: Boolean = true,
    private val isAccountNonLocked: Boolean = true,

    val firstName: String, //TODO  GUI YOK SIGNUP
    val lastName: String, //TODO  GUI YOK SIGNUP

    @Lob
    @JdbcTypeCode(Types.LONGVARBINARY)
    val profilePicture: ByteArray? = null,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    val role: Role,
    val dateOfBirth: LocalDate, //TODO  GUI YOK

    @OneToOne(mappedBy = "user", cascade = [CascadeType.ALL], fetch = FetchType.LAZY, optional = true)
    val merchant: Merchant? = null,

    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    val reviews: List<Review> = mutableListOf(),

    @Column(nullable = false)
    var accountBalance: BigDecimal = BigDecimal.valueOf(1000),

    @OneToOne(fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    @JoinColumn(name = "cart_id", nullable = true)
    val cart: Cart,

    @Column(nullable = false)
    var socialCredit: BigDecimal = BigDecimal.ZERO,

    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    var purchases: List<Purchase> = mutableListOf()


) : UserDetails{
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return role.authorities.toMutableSet()
    }

    override fun getPassword(): String {
        return password
    }

    override fun getUsername(): String {
        return username
    }

    override fun isAccountNonExpired(): Boolean {
        return isAccountNonExpired
    }

    override fun isAccountNonLocked(): Boolean {
        return isAccountNonLocked
    }

    override fun isCredentialsNonExpired(): Boolean {
        return isCredentialsNonExpired
    }

    override fun isEnabled(): Boolean {
        return isEnabled
    }

}
