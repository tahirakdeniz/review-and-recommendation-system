package com.rrss.backend.service;

import com.rrss.backend.dto.MerchantRequestDto;
import com.rrss.backend.enums.MerchantRequestStatus;
import com.rrss.backend.exception.custom.MerchantRequestNotFoundException;
import com.rrss.backend.model.MerchantRequest;
import com.rrss.backend.model.User;
import com.rrss.backend.repository.MerchantRequestRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class MerchantRequestService {
    private final MerchantRequestRepository repository;
    private final UserService userService;

    public MerchantRequestService(MerchantRequestRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }


    public String answerRequest(String username, String message, boolean isApproved) {

        MerchantRequest request = repository
                .findMerchantRequestByUsername(username)
                .orElseThrow(() -> new MerchantRequestNotFoundException("no such merchant request"));

        User oldUser = request.getUser();

        if (isApproved) {
            userService.changeUserRole(oldUser, "MERCHANT");
            repository.save(
                    new MerchantRequest(
                            request.getId(),
                            oldUser,
                            request.getRequestDate(),
                            LocalDateTime.now(),
                            message,
                            MerchantRequestStatus.APPROVED
                    )
            );
        } else {
            repository.delete(request);
        }

        return "Request has been " + ((isApproved) ? "approved" : "rejected") + " successfully";
    }


    public List<MerchantRequestDto> getPendingRequests() {
        return repository.findAllByStatusOrderByRequestDateAsc(MerchantRequestStatus.PENDING)
                .stream()
                .map(MerchantRequestDto::convert)
                .toList();
    }

    public List<MerchantRequestDto> getApprovedRequests() {
        return repository.findAllByStatusOrderByAnsweredDateDesc(MerchantRequestStatus.APPROVED)
                .stream()
                .map(MerchantRequestDto::convert)
                .toList();
    }

    public List<MerchantRequestDto> getRejectedRequests() {
        return repository.findAllByStatusOrderByAnsweredDateDesc(MerchantRequestStatus.REJECTED)
                .stream()
                .map(MerchantRequestDto::convert)
                .toList();
    }


}
