package com.rrss.backend.controller;

import com.rrss.backend.dto.MerchantRequestAnswer;
import com.rrss.backend.dto.MerchantRequestDto;
import com.rrss.backend.service.MerchantRequestService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> answerRequest(@PathVariable String username, @RequestBody MerchantRequestAnswer merchantRequestAnswer) {
        return ResponseEntity.ok(merchantRequestService.answerRequest(username, merchantRequestAnswer.message(), merchantRequestAnswer.isApproved()));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<MerchantRequestDto>> getPendingRequests() {
        return ResponseEntity.ok(merchantRequestService.getPendingRequests());
    }

    @GetMapping("/approved")
    public ResponseEntity<List<MerchantRequestDto>> getApprovedRequests() {
        return ResponseEntity.ok(merchantRequestService.getApprovedRequests());
    }

    @GetMapping("/rejected")
    public ResponseEntity<List<MerchantRequestDto>> getRejectedRequests() {
        return ResponseEntity.ok(merchantRequestService.getRejectedRequests());
    }
}
