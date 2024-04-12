package com.rrss.backend.controller;

import com.rrss.backend.dto.ResetPasswordReqeuest;
import com.rrss.backend.service.PasswordResetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/password-reset")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("{username}")
    public ResponseEntity<String> createToken(@PathVariable String username) {
        return new ResponseEntity<>(passwordResetService.createToken(username), HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordReqeuest resetPasswordReqeuest) {
        return ResponseEntity.ok(passwordResetService.resetPassword(resetPasswordReqeuest));
    }
}
