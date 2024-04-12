package com.rrss.backend.service;

import com.rrss.backend.dto.ResetPasswordReqeuest;
import com.rrss.backend.model.ConfirmationToken;
import com.rrss.backend.model.PasswordResetToken;
import com.rrss.backend.model.User;
import com.rrss.backend.repository.PasswordResetTokenRepository;
import com.rrss.backend.util.EmailUtil;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class PasswordResetService {

    private final PasswordResetTokenRepository repository;
    private final UserService userService;
    private final EmailUtil emailUtil;

    @Value("${constants.otp-token-duration}")
    int otpTokenDuration;

    public PasswordResetService(PasswordResetTokenRepository repository, UserService userService, EmailUtil emailUtil) {
        this.repository = repository;
        this.userService = userService;
        this.emailUtil = emailUtil;
    }


    public String createToken(String username) {
        User user = userService.findByUsername(username);

        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(otpTokenDuration);

        PasswordResetToken passwordResetToken = repository.findByUser(user)
                .map(existingToken -> new PasswordResetToken(
                        existingToken.getId(),
                        user,
                        generateOtp(),
                        expirationTime))
                .orElseGet(() -> new PasswordResetToken(
                        user,
                        generateOtp(),
                        expirationTime));

        try {
            emailUtil.sendForgotPasswordEmail(user.getEmail(), passwordResetToken.getOtp());
        } catch (MessagingException e) {
            throw new RuntimeException("Unable to send otp please try again");
        }

        return "password reset token created successfully";

    }

    public String resetPassword(ResetPasswordReqeuest resetPasswordReqeuest) {

        User user = userService.findByUsername(resetPasswordReqeuest.username());

        PasswordResetToken passwordResetToken = repository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Password reset token not found"));

        if (passwordResetToken.getExpirationTime().isBefore(LocalDateTime.now())) {
            createToken(user.getUsername());
            throw new RuntimeException("Password reset token expired");
        }

        if(!passwordResetToken.getOtp().equals(resetPasswordReqeuest.otp())) {
            throw new RuntimeException("Invalid otp");
        }

        return userService.updatePassword(user, resetPasswordReqeuest.password());

    }

    private String generateOtp() {
        Random random = new Random();
        int randomNumber = random.nextInt(99999);
        StringBuilder output = new StringBuilder(Integer.toString(randomNumber));

        while (output.length() < 5) {
            output.insert(0, "0");
        }

        return output.toString();
    }

}
