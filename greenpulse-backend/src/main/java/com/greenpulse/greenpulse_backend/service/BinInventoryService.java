package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.BinInventoryResponseDTO;
import com.greenpulse.greenpulse_backend.enums.BinStatusEnum;
import com.greenpulse.greenpulse_backend.exception.BinAlreadyExistsException;
import com.greenpulse.greenpulse_backend.exception.BinNotFoundException;
import com.greenpulse.greenpulse_backend.exception.UserNotFoundException;
import com.greenpulse.greenpulse_backend.model.BinInventory;
import com.greenpulse.greenpulse_backend.model.BinOwnerProfile;
import com.greenpulse.greenpulse_backend.model.BinStatus;
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
        List<BinInventory> binInventories;

        if (status != null && ownerId != null) {
            binInventories = binInventoryRepository.findByStatusAndOwner_UserId(status, ownerId);
        } else if (status != null) {
            binInventories = binInventoryRepository.findByStatus(status);
        } else if (ownerId != null) {
            binInventories = binInventoryRepository.findByOwner_UserId(ownerId);
        } else {
            binInventories = binInventoryRepository.findAll();
        }

        List<BinInventoryResponseDTO> bins = binInventories.stream()
                .map(bin -> {
                    BinInventoryResponseDTO dto = new BinInventoryResponseDTO();
                    dto.setBinId(bin.getBinId());
                    dto.setStatus(bin.getStatus());
                    dto.setAssignedDate(bin.getAssignedDate());
                    dto.setLocation(bin.getLocation());
                    return dto;
                })
                .toList();

        return ApiResponse.<List<BinInventory>>builder()
                .success(true)
                .message("Bins are fetched successfully")
                .data(binInventories)
                .timestamp(LocalDateTime.now().toString())
                .build();
    }

    public ApiResponse<List<BinInventoryResponseDTO>> fetchUserBins(UUID ownerId) {
        List<BinInventory> binInventories = binInventoryRepository.findByOwner_UserId(ownerId);

        List<BinInventoryResponseDTO> bins = binInventories.stream()
                .map(bin -> {
                    BinInventoryResponseDTO dto = new BinInventoryResponseDTO();
                    dto.setBinId(bin.getBinId());
                    dto.setStatus(bin.getStatus());
                    dto.setAssignedDate(bin.getAssignedDate());
                    dto.setLocation(bin.getLocation());
                    return dto;
                })
                .toList();

        return ApiResponse.<List<BinInventoryResponseDTO>>builder()
                .success(true)
                .message("Bins are fetched successfully")
                .data(bins)
                .timestamp(LocalDateTime.now().toString())
                .build();
    }


    @Transactional
    public ApiResponse<BinInventory> addBin(String binId) {
        if (binInventoryRepository.existsById(binId)) {
            throw new BinAlreadyExistsException(binId);
        }

        BinInventory binInventory = new BinInventory();
        binInventory.setBinId(binId);
        binInventory.setStatus(BinStatusEnum.AVAILABLE);
        binInventory.setAssignedDate(null);
        binInventory.setLocation(null);


        BinStatus binStatus = new BinStatus();
        binStatus.setBin(binInventory);
        binStatus.setPlasticLevel(0L);
        binStatus.setPaperLevel(0L);
        binStatus.setGlassLevel(0L);
        binStatus.setLastEmptiedAt(null);

        binInventory.setBinStatus(binStatus);

        binInventoryRepository.save(binInventory);

        return ApiResponse.<BinInventory>builder()
                .success(true)
                .message("Bin added successfully")
                .data(null)
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
                .data(null)
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
                .data(null)
                .build();
    }

    public ApiResponse<BinInventory> assignBinToOwner(String binId, UUID userId) {
        BinInventory bin = binInventoryRepository.findById(binId)
                .orElseThrow(() -> new BinNotFoundException("Bin not found"));

        if (bin.getOwner() != null) {
            throw new IllegalStateException("Bin is already assigned to another owner");
        }

        BinOwnerProfile owner = binOwnerProfileRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Bin owner profile not found"));

        bin.assignToOwner(owner);
        binInventoryRepository.save(bin);

        return ApiResponse.<BinInventory>builder()
                .success(true)
                .message("Bin successfully assigned")
                .data(null)
                .timestamp(LocalDateTime.now().toString())
                .build();
    }
}