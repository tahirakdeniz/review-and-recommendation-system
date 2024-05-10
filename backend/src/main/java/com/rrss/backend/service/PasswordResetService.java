package com.rrss.backend.service;

import com.rrss.backend.dto.ResetPasswordRequest;
import com.rrss.backend.exception.custom.InvalidOtpTokenException;
import com.rrss.backend.exception.custom.OtpTokenNotFoundException;
import com.rrss.backend.exception.custom.OtpTokenSendingException;
import com.rrss.backend.exception.custom.OtpTokenExpiredException;
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
            throw new OtpTokenSendingException("Unable to send otp please try again");
        }

        repository.save(passwordResetToken);

        return "password reset token created successfully";

    }

    public String resetPassword(ResetPasswordRequest resetPasswordRequest) {

        User user = userService.findByUsername(resetPasswordRequest.username());

        PasswordResetToken passwordResetToken = repository.findByUser(user)
                .orElseThrow(() -> new OtpTokenNotFoundException("Password reset token not found"));

        if (passwordResetToken.getExpirationTime().isBefore(LocalDateTime.now())) {
            createToken(user.getUsername());
            throw new OtpTokenExpiredException("Password reset token expired");
        }

        if(!passwordResetToken.getOtp().equals(resetPasswordRequest.otp())) {
            throw new InvalidOtpTokenException("Invalid otp");
        }

        return userService.updatePassword(user, resetPasswordRequest.password());

    }

    private String generateOtp() {
        Random random = new Random();
        int randomNumber = random.nextInt(99999);
        StringBuilder output = new StringBuilder(Integer.toString(randomNumber));

        while (output.length() < 6) {
            output.insert(0, "0");
        }

        //return output.toString();
        return "000000";

    }

}
