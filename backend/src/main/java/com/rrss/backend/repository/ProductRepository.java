package com.rrss.backend.repository;

import com.rrss.backend.model.Product;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product>  findProductsByName (String categoryName);
}
