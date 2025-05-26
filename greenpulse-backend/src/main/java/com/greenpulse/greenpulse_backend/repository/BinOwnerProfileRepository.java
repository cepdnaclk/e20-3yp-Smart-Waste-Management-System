package com.greenpulse.greenpulse_backend.repository;

import com.greenpulse.greenpulse_backend.model.BinOwnerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BinOwnerProfileRepository extends JpaRepository<BinOwnerProfile, UUID> {
}
