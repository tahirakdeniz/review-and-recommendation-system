package com.rrss.backend.service;

import com.rrss.backend.enums.MerchantRequestStatus;
import com.rrss.backend.model.MerchantRequest;
import com.rrss.backend.model.User;
import com.rrss.backend.repository.MerchantRequestRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class MerchantRequestService {
    private final MerchantRequestRepository repository;
    private final UserService userService;

    public MerchantRequestService(MerchantRequestRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }


    @PreAuthorize("hasAuthority('APPROVE_MERCHANT_REQUEST')")
    public String answerRequest(String username, String message, boolean isApproved) {

        MerchantRequest request = repository
                .findMerchantRequestByUsername(username)
                .orElseThrow(() -> new RuntimeException("no such merchant request"));

        User oldUser = request.getUser();

        if (isApproved)
            userService.changeUserRole(oldUser, "MERCHANT");

        repository.save(
                new MerchantRequest(
                        request.getId(),
                        oldUser,
                        request.getRequestDate(),
                        LocalDateTime.now(),
                        message,
                        (isApproved) ? MerchantRequestStatus.APPROVED : MerchantRequestStatus.REJECTED
                )
        );



        return "Request has been " + ((isApproved) ? "approved" : "rejected") + " successfully";
    }


    protected void createRequest(User user) {
        repository.save(new MerchantRequest(user));
    }
}
