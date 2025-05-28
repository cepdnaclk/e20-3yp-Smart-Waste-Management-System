package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.exception.InvalidPinException;
import com.greenpulse.greenpulse_backend.exception.PinExpiredException;
import com.greenpulse.greenpulse_backend.exception.TooSoonException;
import com.greenpulse.greenpulse_backend.model.BinOwnerProfile;
import com.greenpulse.greenpulse_backend.model.EmailVerification;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.repository.BinOwnerProfileRepository;
import com.greenpulse.greenpulse_backend.repository.EmailVerificationRepository;
import com.greenpulse.greenpulse_backend.exception.VerificationCodeNotFoundException;
import com.greenpulse.greenpulse_backend.repository.UserTableRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmailVerificationService {
    private final EmailVerificationRepository emailVerificationRepository;
    private final BinOwnerProfileRepository binOwnerProfileRepository;
    private final EmailService emailService;
    private final UserTableRepository userTableRepository;

    @Autowired
    public EmailVerificationService(
            EmailVerificationRepository emailVerificationRepository,
            BinOwnerProfileRepository binOwnerProfileRepository,
            EmailService emailService,
            UserTableRepository userTableRepository
    ) {
        this.emailVerificationRepository = emailVerificationRepository;
        this.binOwnerProfileRepository = binOwnerProfileRepository;
        this.emailService = emailService;
        this.userTableRepository = userTableRepository;
    }

    @Transactional
    public void generateEmailVerificationCode(UUID userId) {
        BinOwnerProfile binOwner = binOwnerProfileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Optional<EmailVerification> existing = emailVerificationRepository.findById(userId);

        if (existing.isPresent()) {
            LocalDateTime lastSent = existing.get().getCreatedAt();
            if (lastSent.plusMinutes(1).isAfter(LocalDateTime.now())) {
                throw new TooSoonException("Please wait at least 1 minute before requesting another PIN");
            }
        }


        // Remove previously stored code if exists
        emailVerificationRepository.deleteById(userId);

        String pin = generatePin();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiry = now.plusMinutes(10);

        EmailVerification emailVerification = new EmailVerification();
        emailVerification.setVerificationToken(pin);
        emailVerification.setBinOwner(binOwner);
        emailVerification.setCreatedAt(now);
        emailVerification.setExpiresAt(expiry);

        emailVerificationRepository.save(emailVerification);

        UserTable userTable = userTableRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        emailService.sendVerificationEmail(userTable.getUsername(), pin);
    }

    public void verifyEmail(UUID userId, String verificationToken) {
        EmailVerification verification = emailVerificationRepository.findById(userId)
                .orElseThrow(() -> new VerificationCodeNotFoundException("No verification code found"));

        if(!verification.getVerificationToken().equals(verificationToken)) {
            throw new InvalidPinException("Invalid PIN");
        }

        if(verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new PinExpiredException("PIN expired");
        }

        BinOwnerProfile owner = verification.getBinOwner();
        owner.setEmailVerified(true);
        binOwnerProfileRepository.save(owner);
        emailVerificationRepository.deleteById(userId);
    }

    private String generatePin() {
        SecureRandom random = new SecureRandom();
        int number = random.nextInt(900_000) + 100_000; // generates 6-digit number
        return String.valueOf(number);
    }
}

