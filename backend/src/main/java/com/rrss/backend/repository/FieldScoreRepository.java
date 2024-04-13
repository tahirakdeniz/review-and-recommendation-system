package com.rrss.backend.repository;

import com.rrss.backend.model.FieldScore;
import com.rrss.backend.model.FieldScoreId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FieldScoreRepository extends JpaRepository<FieldScore, FieldScoreId> {
}
