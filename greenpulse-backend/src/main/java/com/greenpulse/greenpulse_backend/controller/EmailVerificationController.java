package com.greenpulse.greenpulse_backend.controller;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.VerifyPinRequestDTO;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.service.EmailVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/email-verification")
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

    @Autowired
    public EmailVerificationController(EmailVerificationService emailVerificationService) {
        this.emailVerificationService = emailVerificationService;
    }

    @PostMapping("/send-pin")
    public ResponseEntity<ApiResponse<Object>> sendVerificationCode(
            @AuthenticationPrincipal UserTable user) {

        UUID userId = user.getId();
        emailVerificationService.generateEmailVerificationCode(userId);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Email verification PIN sent successfully")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build());
    }


    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Object>> verifyPin(@AuthenticationPrincipal UserTable user, @RequestBody VerifyPinRequestDTO request) {
        emailVerificationService.verifyEmail(user.getId(), request.getPin());
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Email verified successfully")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build());
    }

}
