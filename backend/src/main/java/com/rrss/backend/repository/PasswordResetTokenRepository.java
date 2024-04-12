package com.rrss.backend.repository;

import com.rrss.backend.model.PasswordResetToken;
import com.rrss.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long>{
    Optional<PasswordResetToken> findByUser(User user);
}
