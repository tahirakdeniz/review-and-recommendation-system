package com.rrss.backend.controller;

import com.rrss.backend.dto.MerchantRequestAnswer;
import com.rrss.backend.dto.MerchantRequestDto;
import com.rrss.backend.service.MerchantRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/merchant-requests")
public class MerchantRequestController {

    private final MerchantRequestService merchantRequestService;

    public MerchantRequestController(MerchantRequestService merchantRequestService) {
        this.merchantRequestService = merchantRequestService;
    }

    @PutMapping("/answer/{username}")
    @PreAuthorize("hasAuthority('APPROVE_MERCHANT_REQUEST')")
    public ResponseEntity<String> answerRequest(@PathVariable String username, @RequestBody MerchantRequestAnswer merchantRequestAnswer) {
        return ResponseEntity.ok(merchantRequestService.answerRequest(username, merchantRequestAnswer.message(), merchantRequestAnswer.isApproved()));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('SEE_MERCHANT_REQUEST')")
    public ResponseEntity<List<MerchantRequestDto>> getPendingRequests() {
        return ResponseEntity.ok(merchantRequestService.getPendingRequests());
    }

    @GetMapping("/approved")
    @PreAuthorize("hasAuthority('SEE_MERCHANT_REQUEST')")
    public ResponseEntity<List<MerchantRequestDto>> getApprovedRequests() {
        return ResponseEntity.ok(merchantRequestService.getApprovedRequests());
    }

    @Deprecated
    @GetMapping("/rejected")
    @PreAuthorize("hasAuthority('SEE_MERCHANT_REQUEST')")
    public ResponseEntity<List<MerchantRequestDto>> getRejectedRequests() {
        return ResponseEntity.ok(merchantRequestService.getRejectedRequests());
    }


}
