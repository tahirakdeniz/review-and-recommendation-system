package com.rrss.backend.repository;

import com.rrss.backend.enums.InteractionWeightType;
import com.rrss.backend.model.InteractionWeight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InteractionWeightRepository extends JpaRepository<InteractionWeight, Long> {
    boolean existsByInteractionType(InteractionWeightType type);

    Optional<InteractionWeight> findByInteractionType(InteractionWeightType type);
}
