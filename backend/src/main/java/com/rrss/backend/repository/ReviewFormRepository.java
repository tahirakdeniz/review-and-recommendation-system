package com.rrss.backend.repository;

import com.rrss.backend.model.ReviewForm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewFormRepository extends JpaRepository<ReviewForm, Long> {
    Optional<ReviewForm> findByProductTypeName(String productCategoryName);

    boolean existsByproductTypeName(String productCategoryName);

}
