package com.greenpulse.greenpulse_backend.repository;

import com.greenpulse.greenpulse_backend.model.BinInventory;
import com.greenpulse.greenpulse_backend.model.BinStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BinStatusRepository extends JpaRepository<BinStatus, String> {
    String bin(BinInventory bin);
}
