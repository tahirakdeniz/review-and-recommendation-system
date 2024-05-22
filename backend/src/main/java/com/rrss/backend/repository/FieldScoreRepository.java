package com.rrss.backend.repository;

import com.rrss.backend.model.FieldScore;
import com.rrss.backend.model.FieldScoreId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FieldScoreRepository extends JpaRepository<FieldScore, FieldScoreId> {

    @Modifying
    @Query("DELETE FROM FieldScore fs WHERE fs.id.reviewId = :reviewId")
    void deleteAllByReviewId(@Param("reviewId") Long reviewId);
}
