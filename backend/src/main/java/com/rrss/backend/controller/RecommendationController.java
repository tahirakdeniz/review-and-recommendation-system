package com.rrss.backend.controller;

import com.rrss.backend.dto.InteractionWeightDto;
import com.rrss.backend.dto.InteractionWeightRequest;
import com.rrss.backend.dto.ProductDto;
import com.rrss.backend.service.RecommendationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('MANAGE_RECOMMENDATION')")
    public ResponseEntity<List<InteractionWeightDto>> getInteractionWeights() {
        return ResponseEntity.ok(recommendationService.getInteractionWeights());
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('MANAGE_RECOMMENDATION')")
    public ResponseEntity<InteractionWeightDto> addInteractionWeight(InteractionWeightRequest interactionWeightRequest) {
        return new ResponseEntity<>(recommendationService.addInteractionWeight(interactionWeightRequest), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('MANAGE_RECOMMENDATION')")
    public ResponseEntity<InteractionWeightDto> updateInteractionWeight(@PathVariable("id") Long id, InteractionWeightRequest interactionWeightRequest) {
        return ResponseEntity.ok(recommendationService.updateInteractionWeight(interactionWeightRequest, id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('MANAGE_RECOMMENDATION')")
    public ResponseEntity<String> deleteInteractionWeight(@PathVariable("id") Long id) {
        return new ResponseEntity<>(recommendationService.deleteInteractionWeight(id), HttpStatus.NO_CONTENT);
    }

    @GetMapping("/get")
    public ResponseEntity<List<ProductDto>> getRecommendations(Principal currentUser) {
        return new ResponseEntity<>(recommendationService.getProductRecommendations(currentUser), HttpStatus.OK);
    }
}
