package com.rrss.backend.service;

import com.rrss.backend.dto.InteractionWeightDto;
import com.rrss.backend.dto.InteractionWeightRequest;
import com.rrss.backend.dto.ProductDto;
import com.rrss.backend.enums.InteractionWeightType;
import com.rrss.backend.exception.custom.InteractionWeightAlreadyExistException;
import com.rrss.backend.exception.custom.InteractionWeightNotFoundException;
import com.rrss.backend.exception.custom.InvalidRequestException;
import com.rrss.backend.model.*;
import com.rrss.backend.repository.InteractionWeightRepository;
import com.rrss.backend.repository.ProductCategoryRepository;
import com.rrss.backend.repository.ProductRepository;
import com.rrss.backend.repository.UserRepository;
import com.rrss.backend.util.UserUtil;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import java.security.Principal;
import java.util.*;

@Service
public class RecommendationService {

    private final UserUtil userUtil;
    private final InteractionWeightRepository interactionWeightRepository;
    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;


    public RecommendationService(UserUtil userUtil, InteractionWeightRepository interactionWeightRepository, ProductRepository productRepository, ProductCategoryRepository productCategoryRepository) {
        this.userUtil = userUtil;
        this.interactionWeightRepository = interactionWeightRepository;
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
    }

    public List<InteractionWeightDto> getInteractionWeights() {
        return interactionWeightRepository
                .findAll()
                .stream()
                .map(InteractionWeightDto::convert)
                .toList();
    }

    public InteractionWeightDto addInteractionWeight(InteractionWeightRequest interactionWeightRequest) {
        if (interactionWeightRepository.existsByInteractionType(interactionWeightRequest.type())) {
            throw new InteractionWeightAlreadyExistException("interaction with this name exists");
        }

        if (interactionWeightRequest.weight() <= 0) {
            throw new InvalidRequestException("Interaction weight must be greater than zero");
        }

        return InteractionWeightDto.convert(
                interactionWeightRepository.save(
                        new InteractionWeight(
                                interactionWeightRequest.type(),
                                interactionWeightRequest.weight()
                        )
                )
        );
    }

    public InteractionWeightDto updateInteractionWeight(InteractionWeightRequest interactionWeightRequest, Long id) {
        InteractionWeight interactionWeight = interactionWeightRepository
                .findById(id)
                .orElseThrow(() -> new InteractionWeightNotFoundException("Interaction weight not found"));


        Optional<InteractionWeight> checkInteractionWeight = interactionWeightRepository
                .findByInteractionType(interactionWeightRequest.type());

        if (checkInteractionWeight.isPresent()
                && !Objects.equals(checkInteractionWeight.get().getId(), interactionWeight.getId())) {
            throw new InteractionWeightAlreadyExistException("Interaction type already exists");
        }

        return InteractionWeightDto.convert(
                interactionWeightRepository.save(
                        new InteractionWeight(
                                interactionWeight.getId(),
                                interactionWeightRequest.type(),
                                interactionWeightRequest.weight()
                        )
                )
        );
    }

    public String deleteInteractionWeight(Long id) {
        interactionWeightRepository.deleteById(id);

        return "Interaction weight has been deleted";
    }

    private Map<ProductCategory, Double> getCalculatedInteractionWeights(Principal currentUser) {
        Map<ProductCategory, Double> interactionWeights = new HashMap<>();
        User user = userUtil.extractUser(currentUser);

        int interactionWeightForReview = interactionWeightRepository
                .findByInteractionType(InteractionWeightType.REVIEW)
                .map(InteractionWeight::getWeight)
                .orElse(0);
        for (Review review : user.getReviews()) {
            ProductCategory prodCategory = review.getProduct().getProductCategory();
            interactionWeights.put(prodCategory, interactionWeightForReview + interactionWeights.getOrDefault(prodCategory,0d));
        }

        int interactionWeightForPurchase = interactionWeightRepository
                .findByInteractionType(InteractionWeightType.PURCHASE)
                .map(InteractionWeight::getWeight)
                .orElse(0);

        for (Purchase purchase : user.getPurchases()) {
            for (PurchaseItem purchaseItem : purchase.getItems()) {
                ProductCategory prodCategory = purchaseItem.getProduct().getProductCategory();
                interactionWeights.put(prodCategory, (interactionWeightForPurchase * purchaseItem.getQuantity()) + interactionWeights.getOrDefault(prodCategory,0d));
            }
        }

        Double totalWight = interactionWeights
                .values()
                .stream()
                .mapToDouble(Double::doubleValue)
                .sum();

        interactionWeights.replaceAll((k, v) -> v / totalWight);

        if (interactionWeights.isEmpty()) {
            List<ProductCategory> productCategories = productCategoryRepository.findAll();

            for (ProductCategory prod: productCategories) {
                interactionWeights.put(prod, 1.0 / productCategories.size());
            }
        }

        return interactionWeights;
    }

    public List<ProductDto> getProductRecommendations(Principal currentUser) {
        Map<ProductCategory, Double> interactionWeights = getCalculatedInteractionWeights(currentUser);

        List<ProductDto> productDtos = new ArrayList<>();
        for (Map.Entry<ProductCategory, Double> interactionWeightEntry : interactionWeights.entrySet()) {
            if (Math.round(interactionWeightEntry.getValue() * 10) >=  1) {
                Pageable pageable = PageRequest.of(0, (int) Math.round(interactionWeightEntry.getValue() * 10));
                productDtos.addAll(
                        productRepository
                                .findByProductCategoryName(
                                        interactionWeightEntry
                                                .getKey()
                                                .getName(),
                                        pageable
                                ).stream()
                                .map(ProductDto::convert)
                                .toList()
                );
            }
        }

        Collections.shuffle(productDtos);
        return productDtos;
    }
}
