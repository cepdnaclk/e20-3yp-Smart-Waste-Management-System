package com.greenpulse.greenpulse_backend.repository;

import com.greenpulse.greenpulse_backend.enums.BinStatusEnum;
import com.greenpulse.greenpulse_backend.model.BinInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BinInventoryRepository extends JpaRepository<BinInventory, String> {
    List<BinInventory> findByStatusAndOwner_UserId(BinStatusEnum status, UUID ownerId);

    List<BinInventory> findByStatus(BinStatusEnum status);

    List<BinInventory> findByOwner_UserId(UUID ownerId);

    List<BinInventory> getBinOwnerProfileByBinId(String binId);
}
