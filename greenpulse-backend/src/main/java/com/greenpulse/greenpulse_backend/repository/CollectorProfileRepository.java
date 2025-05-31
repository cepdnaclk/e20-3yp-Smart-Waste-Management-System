package com.greenpulse.greenpulse_backend.repository;

import com.greenpulse.greenpulse_backend.model.CollectorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CollectorProfileRepository extends JpaRepository<CollectorProfile, UUID> {
}
