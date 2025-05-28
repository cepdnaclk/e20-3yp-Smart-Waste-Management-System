package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.enums.BinStatusEnum;
import com.greenpulse.greenpulse_backend.exception.BinAlreadyExistsException;
import com.greenpulse.greenpulse_backend.exception.BinNotFoundException;
import com.greenpulse.greenpulse_backend.model.BinInventory;
import com.greenpulse.greenpulse_backend.model.BinOwnerProfile;
import com.greenpulse.greenpulse_backend.repository.BinInventoryRepository;
import com.greenpulse.greenpulse_backend.repository.BinOwnerProfileRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BinInventoryService {
    private final BinInventoryRepository binInventoryRepository;
    private final BinOwnerProfileRepository binOwnerProfileRepository;

    @Autowired
    public BinInventoryService(
            BinInventoryRepository binInventoryRepository,
            BinOwnerProfileRepository binOwnerProfileRepository
    ) {
        this.binInventoryRepository = binInventoryRepository;
        this.binOwnerProfileRepository = binOwnerProfileRepository;
    }

    public ApiResponse<List<BinInventory>> getBinsFiltered(BinStatusEnum status, UUID ownerId) {
        List<BinInventory> bins;

        if (status != null && ownerId != null) {
            bins = binInventoryRepository.findByStatusAndOwner_UserId(status, ownerId);
        } else if (status != null) {
            bins = binInventoryRepository.findByStatus(status);
        } else if (ownerId != null) {
            bins = binInventoryRepository.findByOwner_UserId(ownerId);
        } else {
            bins = binInventoryRepository.findAll();
        }

        return ApiResponse.<List<BinInventory>>builder()
                .success(true)
                .message("Bins are fetched successfully")
                .data(bins)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<BinInventory> addBin(String binId) {
        if (binInventoryRepository.existsById(binId)) {
            throw new BinAlreadyExistsException(binId);
        }

        BinInventory bin = new BinInventory();
        bin.setBinId(binId);
        bin.setStatus(BinStatusEnum.AVAILABLE); // Default status

        return ApiResponse.<BinInventory>builder()
                .success(true)
                .message("Bin added successfully")
                .data(binInventoryRepository.save(bin))
                .build();
    }

    public ApiResponse<Void> deleteBin(String binId) {
        BinInventory bin = binInventoryRepository.findById(binId)
                .orElseThrow(() -> new BinNotFoundException(binId));
        binInventoryRepository.delete(bin);

        return ApiResponse.<Void>builder()
                .success(true)
                .message("Bin deleted successfully")
                .build();
    }

    @Transactional
    public ApiResponse<BinInventory> changeStatus(String binId, BinStatusEnum newStatus) {
        BinInventory bin = binInventoryRepository.findById(binId)
                .orElseThrow(() -> new BinNotFoundException(binId));
        bin.setStatus(newStatus);

        return ApiResponse.<BinInventory>builder()
                .success(true)
                .message("Bin status updated")
                .data(bin)
                .build();
    }

    @Transactional
    public ApiResponse<BinInventory> changeOwner(String binId, UUID newOwnerId) {
        BinInventory bin = binInventoryRepository.findById(binId)
                .orElseThrow(() -> new BinNotFoundException(binId));

        BinOwnerProfile newOwner = binOwnerProfileRepository.findById(newOwnerId)
                .orElseThrow(() -> new RuntimeException("Bin owner not found with ID: " + newOwnerId));

        bin.assignToOwner(newOwner);

        return ApiResponse.<BinInventory>builder()
                .success(true)
                .message("Bin owner changed")
                .data(bin)
                .build();
    }
}