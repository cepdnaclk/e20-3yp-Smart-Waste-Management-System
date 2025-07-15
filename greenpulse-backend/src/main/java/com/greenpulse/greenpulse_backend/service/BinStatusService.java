package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.BinStatusDTO;
import com.greenpulse.greenpulse_backend.exception.BinStatusNotFoundException;
import com.greenpulse.greenpulse_backend.exception.UserNotFoundException;
import com.greenpulse.greenpulse_backend.model.BinInventory;
import com.greenpulse.greenpulse_backend.model.BinStatus;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.repository.BinInventoryRepository;
import com.greenpulse.greenpulse_backend.repository.BinStatusRepository;
import com.greenpulse.greenpulse_backend.repository.UserTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
public class BinStatusService {

    private final BinStatusRepository binStatusRepository;
    private final BinInventoryRepository binInventoryRepository;
    private final UserTableRepository userTableRepository;
    private final NotificationService notificationService;

    @Autowired
    public BinStatusService(
            BinStatusRepository binStatusRepository,
            BinInventoryRepository binInventoryRepository,
            UserTableRepository userTableRepository,
            NotificationService notificationService
    ) {
        this.binStatusRepository = binStatusRepository;
        this.binInventoryRepository = binInventoryRepository;
        this.userTableRepository = userTableRepository;
        this.notificationService = notificationService;
    }

    public ApiResponse<BinStatusDTO> getBinStatus(String binId, UUID userId) {
        BinInventory binInventory = binInventoryRepository.findById(binId)
                .orElseThrow(() -> new BinStatusNotFoundException(binId));;

        UserTable user =  userTableRepository.findById(binInventory.getOwner().getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if(!user.getId().equals(userId)) {
            throw new UserNotFoundException("User not found for given bin");
        }

        BinStatus binStatus = binStatusRepository.findById(binId)
                .orElseThrow(() -> new BinStatusNotFoundException(binId));

        BinStatusDTO binStatusDTO = new BinStatusDTO();

        binStatusDTO.setBinId(binId);
        binStatusDTO.setPlasticLevel(binStatus.getPlasticLevel());
        binStatusDTO.setGlassLevel(binStatus.getGlassLevel());
        binStatusDTO.setPaperLevel(binStatus.getPaperLevel());

        return ApiResponse.<BinStatusDTO>builder()
                .success(true)
                .message("Bin status fetched successfully")
                .data(binStatusDTO)
                .timestamp(LocalDateTime.now().toString())
                .build();

    }

    public void updateBinLevels(BinStatusDTO binStatusDTO) {
        BinStatus status = binStatusRepository.findById(binStatusDTO.getBinId())
                .orElseThrow(() -> new BinStatusNotFoundException("Bin status not found for bin: " + binStatusDTO.getBinId()));

        // Store old levels for comparison
        Long oldPlasticLevel = status.getPlasticLevel();
        Long oldPaperLevel = status.getPaperLevel();
        Long oldGlassLevel = status.getGlassLevel();

        status.setPlasticLevel(binStatusDTO.getPlasticLevel());
        status.setPaperLevel(binStatusDTO.getPaperLevel());
        status.setGlassLevel(binStatusDTO.getGlassLevel());
        binStatusRepository.save(status);

        checkAndTriggerNotifications(status, oldPlasticLevel, oldPaperLevel, oldGlassLevel);
    }

    public BinStatus updateLastEmptiedAt(String binId, BinStatusDTO binStatusDTO) {
        BinStatus status = binStatusRepository.findById(binId)
                .orElseThrow(() -> new BinStatusNotFoundException(binId));

        status.setLastEmptiedAt(binStatusDTO.getLastEmptiedAt());
        return binStatusRepository.save(status);
    }


    private void checkAndTriggerNotifications(BinStatus binStatus, Long oldPlasticLevel, Long oldPaperLevel, Long oldGlassLevel) {
        String binId = binStatus.getBinId();
        UUID binOwnerId = getBinOwnerId(binId);

        // Check plastic level
        if (isLevelHigh(binStatus.getPlasticLevel()) && !isLevelHigh(oldPlasticLevel)) {
            int percentage = binStatus.getPlasticLevel().intValue(); // Direct conversion since it's already a percentage
            log.info("High plastic level detected for bin {}: {}%", binId, percentage);
            notificationService.createFillLevelNotification(binId, percentage, binOwnerId);
        }

        // Check paper level
        if (isLevelHigh(binStatus.getPaperLevel()) && !isLevelHigh(oldPaperLevel)) {
            int percentage = binStatus.getPaperLevel().intValue();
            log.info("High paper level detected for bin {}: {}%", binId, percentage);
            notificationService.createFillLevelNotification(binId, percentage, binOwnerId);
        }

        // Check glass level
        if (isLevelHigh(binStatus.getGlassLevel()) && !isLevelHigh(oldGlassLevel)) {
            int percentage = binStatus.getGlassLevel().intValue();
            log.info("High glass level detected for bin {}: {}%", binId, percentage);
            notificationService.createFillLevelNotification(binId, percentage, binOwnerId);
        }
    }

    private boolean isLevelHigh(Long level) {
        return level != null && level >= 90L; // Use 90L for consistency
    }

    private UUID getBinOwnerId(String binId) {
        BinInventory bin = binInventoryRepository.findById(binId)
                .orElseThrow(() -> new BinStatusNotFoundException("Bin not found: " + binId));
        return bin.getOwner().getUserId();
    }

    public void checkAllBinsForHighLevels() {
        List<BinStatus> highLevelBins = binStatusRepository.findBinsWithHighFillLevel(90L);

        for (BinStatus binStatus : highLevelBins) {
            checkAndTriggerNotifications(binStatus, 0L, 0L, 0L);
        }
    }

}
