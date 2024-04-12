package com.rrss.backend.controller;

import com.rrss.backend.dto.ConfirmationTokenDto;
import com.rrss.backend.dto.CreateTokenRequest;
import com.rrss.backend.service.ConfirmationService;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/confirmation")
public class ConfirmationController {

    private final ConfirmationService confirmationService;


    public ConfirmationController(ConfirmationService confirmationService) {
        this.confirmationService = confirmationService;
    }


    @PostMapping
    public ResponseEntity<ConfirmationTokenDto> createConfirmationToken(@RequestBody CreateTokenRequest createTokenRequest) {
        return new ResponseEntity<>(confirmationService.createToken(createTokenRequest), HttpStatus.CREATED);
    }


}
