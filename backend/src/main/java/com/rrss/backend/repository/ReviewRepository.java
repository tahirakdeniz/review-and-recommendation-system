package com.rrss.backend.repository;

import com.rrss.backend.model.Product;
import com.rrss.backend.model.Review;
import com.rrss.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long>{

}
