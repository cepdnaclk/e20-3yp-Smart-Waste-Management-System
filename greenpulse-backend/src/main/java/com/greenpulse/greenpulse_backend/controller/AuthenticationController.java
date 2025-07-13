package com.greenpulse.greenpulse_backend.controller;

import com.greenpulse.greenpulse_backend.dto.*;
import com.greenpulse.greenpulse_backend.exception.InvalidPinException;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.greenpulse.greenpulse_backend.service.PasswordResetService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final PasswordResetService passwordResetService;

    public AuthenticationController(AuthenticationService authenticationService, PasswordResetService passwordResetService) {
        this.authenticationService = authenticationService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthenticationDataDTO>> register(
            @RequestBody RegisterRequestDTO request
    ) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<ApiResponse<AuthenticationDataDTO>> authenticate(
            @RequestBody AuthenticationRequestDTO request
    ) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<PasswordResetResponseDTO>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDTO request) {

        PasswordResetResponseDTO response = passwordResetService.sendResetEmail(request.getEmail());

        return ResponseEntity.ok(ApiResponse.<PasswordResetResponseDTO>builder()
                .success(true)
                .message("If email exists, reset PIN has been sent")
                .data(response)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PostMapping("/verify-reset-pin")
    public ResponseEntity<ApiResponse<PasswordResetResponseDTO>> verifyResetPin(
            @AuthenticationPrincipal UserTable user,
            @Valid @RequestBody VerifyResetPinRequestDTO request) {

        PasswordResetResponseDTO response = passwordResetService.verifyResetPin(
                request.getPin(),
                request.getEmail()
        );

        return ResponseEntity.ok(ApiResponse.<PasswordResetResponseDTO>builder()
                .success(true)
                .message("PIN verified successfully")
                .data(response)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Object>> resetPassword(
            @AuthenticationPrincipal UserTable user,
            @Valid @RequestBody ResetPasswordRequestDTO request) {

        if (user == null) {
            throw new InvalidPinException("User not authenticated");
        }

        passwordResetService.resetPassword(request.getNewPassword());

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Password reset successfully")
                .data(null)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }


    @PostMapping("/resend-reset-pin")
    public ResponseEntity<ApiResponse<Object>> resendResetPin(
            @AuthenticationPrincipal UserTable user,
            @RequestBody Map<String, String> request) {

        passwordResetService.resendResetPin(request.get("email"));

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Reset PIN resent successfully")
                .data(null)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }


}