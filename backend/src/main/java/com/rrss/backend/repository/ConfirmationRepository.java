package com.rrss.backend.repository;

import com.rrss.backend.model.ConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConfirmationRepository extends JpaRepository<ConfirmationToken, Long> {
    Optional<ConfirmationToken> findByEmail(String email);
}
