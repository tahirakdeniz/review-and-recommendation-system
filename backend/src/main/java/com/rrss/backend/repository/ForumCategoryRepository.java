package com.rrss.backend.repository;

import com.rrss.backend.model.ForumCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ForumCategoryRepository extends JpaRepository<ForumCategory, Long> {
    Optional<ForumCategory> findByName(String name);

}
