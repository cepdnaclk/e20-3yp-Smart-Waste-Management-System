package com.greenpulse.greenpulse_backend.repository;

import com.greenpulse.greenpulse_backend.model.PasswordResetToken;
import com.greenpulse.greenpulse_backend.model.UserTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUserAndPin(UserTable user, String pin);
    Optional<PasswordResetToken> findByUserAndPinIsNull(UserTable user); // Add this method
    Optional<PasswordResetToken> findByUser(UserTable user);
    void deleteByUser(UserTable user);
    void deleteByExpiresAtBefore(LocalDateTime currentTime);
}
