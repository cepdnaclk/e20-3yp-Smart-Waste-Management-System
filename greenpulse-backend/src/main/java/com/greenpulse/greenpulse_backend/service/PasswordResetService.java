package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.dto.PasswordResetResponseDTO;
import com.greenpulse.greenpulse_backend.exception.InvalidPinException;
import com.greenpulse.greenpulse_backend.model.PasswordResetToken;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.repository.PasswordResetTokenRepository;
import com.greenpulse.greenpulse_backend.repository.UserTableRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final UserTableRepository userTableRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public PasswordResetService(
            UserTableRepository userTableRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder
    ) {
        this.userTableRepository = userTableRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public PasswordResetResponseDTO sendResetEmail(String email) {
        UserTable user = userTableRepository.findByUsername(email).orElse(null);

        if (user != null) {
            // Clean up any existing tokens for this user
            passwordResetTokenRepository.deleteByUser(user);

            // Generate 6-digit PIN
            String pin = generateSixDigitPin();

            // Generate session token for this reset session
            String sessionToken = UUID.randomUUID().toString();

            // Save token and PIN to database
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .user(user)
                    .token(sessionToken)
                    .pin(pin)
                    .expiresAt(LocalDateTime.now().plusMinutes(10)) // 10 minutes for PIN
                    .createdAt(LocalDateTime.now())
                    .build();

            passwordResetTokenRepository.save(resetToken);

            // Send PIN via email
            try {
                emailService.sendPasswordResetEmail(user.getUsername(), pin);
                System.out.println("Password reset PIN sent to: " + user.getUsername());
            } catch (Exception e) {
                System.err.println("Failed to send email: " + e.getMessage());
                e.printStackTrace();
            }

            return PasswordResetResponseDTO.builder()
                    .sessionToken(sessionToken)
                    .email(email)
                    .expiresIn(10 * 60 * 1000L) // 10 minutes in milliseconds
                    .build();
        }

        // Return dummy response for security (don't reveal if email exists)
        return PasswordResetResponseDTO.builder()
                .sessionToken("dummy-token")
                .email(email)
                .expiresIn(10 * 60 * 1000L)
                .build();
    }

    @Transactional
    public PasswordResetResponseDTO verifyResetPin(String sessionToken, String pin, String email) {
        // Find the reset token record
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenAndPin(sessionToken, pin)
                .orElseThrow(() -> new InvalidPinException("Invalid PIN or session token"));

        // Check if token is expired
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(resetToken);
            throw new InvalidPinException("Reset session has expired");
        }

        // Verify email matches
        if (!resetToken.getUser().getUsername().equals(email)) {
            throw new InvalidPinException("Email mismatch");
        }

        // Generate verified token for password reset
        String verifiedToken = UUID.randomUUID().toString();
        resetToken.setToken(verifiedToken);
        resetToken.setPin(null); // Clear PIN after verification
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(5)); // 5 minutes to complete reset
        passwordResetTokenRepository.save(resetToken);

        return PasswordResetResponseDTO.builder()
                .verifiedToken(verifiedToken)
                .email(email)
                .expiresIn(5 * 60 * 1000L) // 5 minutes in milliseconds
                .build();
    }

    @Transactional
    public void resetPassword(String verifiedToken, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(verifiedToken)
                .orElseThrow(() -> new InvalidPinException("Invalid verification token"));

        // Check if token is expired
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(resetToken);
            throw new InvalidPinException("Verification token has expired");
        }

        // Ensure this is a verified token (PIN should be null)
        if (resetToken.getPin() != null) {
            throw new InvalidPinException("Token not verified");
        }

        // Update password
        UserTable user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userTableRepository.save(user);

        // Clean up token
        passwordResetTokenRepository.delete(resetToken);
    }

    @Transactional
    public void resendResetPin(String sessionToken, String email) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(sessionToken)
                .orElseThrow(() -> new InvalidPinException("Invalid session token"));

        // Check if user email matches
        if (!resetToken.getUser().getUsername().equals(email)) {
            throw new InvalidPinException("Email mismatch");
        }

        // Generate new PIN
        String newPin = generateSixDigitPin();
        resetToken.setPin(newPin);
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        passwordResetTokenRepository.save(resetToken);

        // Send new PIN via email
        emailService.sendPasswordResetEmail(email, newPin);
    }

    private String generateSixDigitPin() {
        Random random = new Random();
        int pin = 100000 + random.nextInt(900000);
        return String.valueOf(pin);
    }
}
