package com.rrss.backend.repository;

import com.rrss.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product>  findProductsByName (String categoryName);

    List<Product> findByProductCategoryName(String categoryName);

    List<Product> findByProductCategoryName(String categoryName, Pageable pageable);

    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase (String searchKey1, String searchKey2);


}
