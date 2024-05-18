package com.rrss.backend.repository;

import com.rrss.backend.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    Optional<ProductCategory> findByName(String name);

    boolean existsByName(String name);

    @Query("SELECT CASE WHEN COUNT(pc) > 0 THEN TRUE ELSE FALSE END FROM ProductCategory pc JOIN pc.products p WHERE pc.id = :categoryId")
    boolean existsWithAssignedProducts(@Param("categoryId") Long categoryId);
}
