package com.rrss.backend.repository;

import com.rrss.backend.model.Product;
import com.rrss.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    List<User> findByUsernameContainingIgnoreCase(String username);

    List<User> findByIsAccountNonLockedFalse();

}
