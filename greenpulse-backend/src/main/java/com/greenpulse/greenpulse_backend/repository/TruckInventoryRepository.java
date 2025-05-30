package com.greenpulse.greenpulse_backend.repository;

import com.greenpulse.greenpulse_backend.enums.TruckStatusEnum;
import com.greenpulse.greenpulse_backend.model.TruckInventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TruckInventoryRepository extends JpaRepository<TruckInventory, Long> {
    List<TruckInventory> findByStatusAndCapacityKgGreaterThanEqual(TruckStatusEnum status, Long minCapacityKg);

    List<TruckInventory> findByStatus(TruckStatusEnum status);

    List<TruckInventory> findByCapacityKgGreaterThanEqual(Long minCapacityKg);
}
