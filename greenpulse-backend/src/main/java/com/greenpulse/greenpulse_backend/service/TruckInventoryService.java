package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.enums.TruckStatusEnum;
import com.greenpulse.greenpulse_backend.exception.TruckNotFoundException;
import com.greenpulse.greenpulse_backend.model.TruckInventory;
import com.greenpulse.greenpulse_backend.repository.TruckInventoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TruckInventoryService {

    private final TruckInventoryRepository truckInventoryRepository;

    @Autowired
    public TruckInventoryService(TruckInventoryRepository truckInventoryRepository) {
        this.truckInventoryRepository = truckInventoryRepository;
    }

    public ApiResponse<List<TruckInventory>> getTrucksFiltered(TruckStatusEnum status, Long minCapacityKg) {
        List<TruckInventory> trucks;

        if (status != null && minCapacityKg != null) {
            trucks = truckInventoryRepository.findByStatusAndCapacityKgGreaterThanEqual(status, minCapacityKg);
        } else if (status != null) {
            trucks = truckInventoryRepository.findByStatus(status);
        } else if (minCapacityKg != null) {
            trucks = truckInventoryRepository.findByCapacityKgGreaterThanEqual(minCapacityKg);
        } else {
            trucks = truckInventoryRepository.findAll();
        }

        return ApiResponse.<List<TruckInventory>>builder()
                .success(true)
                .message("Trucks fetched successfully")
                .data(trucks)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<TruckInventory> addTruck(String registrationNumber, Long capacityKg) {
        TruckInventory truck = new TruckInventory();
        truck.setRegistrationNumber(registrationNumber);
        truck.setCapacityKg(capacityKg);
        truck.setStatus(TruckStatusEnum.AVAILABLE);

        return ApiResponse.<TruckInventory>builder()
                .success(true)
                .message("Truck added successfully")
                .data(truckInventoryRepository.save(truck))
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<Void> deleteTruck(Long truckId) {
        TruckInventory truck = truckInventoryRepository.findById(truckId)
                .orElseThrow(() -> new TruckNotFoundException("Truck with ID: " + truckId + " not found"));

        truckInventoryRepository.delete(truck);

        return ApiResponse.<Void>builder()
                .success(true)
                .message("Truck deleted successfully")
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Transactional
    public ApiResponse<TruckInventory> changeStatus(Long truckId, TruckStatusEnum newStatus) {
        TruckInventory truck = truckInventoryRepository.findById(truckId)
                .orElseThrow(() -> new TruckNotFoundException("Truck with ID: " + truckId + " not found"));

        if (truck.getStatus() == newStatus) {
            return ApiResponse.<TruckInventory>builder()
                    .success(true)
                    .message("Truck is already in the requested status")
                    .data(truck)
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        if (TruckStatusEnum.NEEDS_REPAIR.equals(truck.getStatus()) &&
                TruckStatusEnum.AVAILABLE.equals(newStatus)) {
            truck.setLastMaintenance(LocalDate.now());
        }

        truck.setStatus(newStatus);

        return ApiResponse.<TruckInventory>builder()
                .success(true)
                .message("Truck status updated")
                .data(truck)
                .timestamp(LocalDateTime.now())
                .build();
    }
}