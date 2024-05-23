package com.rrss.backend.repository;

import com.rrss.backend.model.FieldScore;
import com.rrss.backend.model.FieldScoreId;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FieldScoreRepository extends JpaRepository<FieldScore, FieldScoreId> {

    @Modifying
    @Transactional
    @Query("DELETE FROM FieldScore fs WHERE fs.review.id = :reviewId")
    void deleteAllByReviewId(@Param("reviewId") Long reviewId);
}
