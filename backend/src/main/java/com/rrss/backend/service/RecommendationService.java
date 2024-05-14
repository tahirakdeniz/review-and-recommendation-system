package com.rrss.backend.service;

import com.rrss.backend.dto.InteractionWeightDto;
import com.rrss.backend.dto.InteractionWeightRequest;
import com.rrss.backend.exception.custom.InteractionWeightAlreadyExistException;
import com.rrss.backend.exception.custom.InteractionWeightNotFoundException;
import com.rrss.backend.exception.custom.InvalidRequestException;
import com.rrss.backend.model.InteractionWeight;
import com.rrss.backend.repository.InteractionWeightRepository;
import com.rrss.backend.repository.UserRepository;
import com.rrss.backend.util.UserUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class RecommendationService {

    private final UserRepository userRepository;
    private final UserUtil userUtil;
    private final InteractionWeightRepository interactionWeightRepository;


    public RecommendationService(UserRepository userRepository, UserUtil userUtil, InteractionWeightRepository interactionWeightRepository) {
        this.userRepository = userRepository;
        this.userUtil = userUtil;
        this.interactionWeightRepository = interactionWeightRepository;
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
}
