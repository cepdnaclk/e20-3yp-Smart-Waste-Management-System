package com.greenpulse.greenpulse_backend.repository;

import com.greenpulse.greenpulse_backend.model.CollectorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CollectorProfileRepository extends JpaRepository<CollectorProfile, UUID> {
    CollectorProfile findByName(String name);
}
