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

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class BinStatusService {

    private final BinStatusRepository binStatusRepository;
    private final BinInventoryRepository binInventoryRepository;
    private final UserTableRepository userTableRepository;

    @Autowired
    public BinStatusService(
            BinStatusRepository binStatusRepository,
            BinInventoryRepository binInventoryRepository,
            UserTableRepository userTableRepository
    ) {
        this.binStatusRepository = binStatusRepository;
        this.binInventoryRepository = binInventoryRepository;
        this.userTableRepository = userTableRepository;
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

        status.setPlasticLevel(binStatusDTO.getPlasticLevel());
        status.setPaperLevel(binStatusDTO.getPaperLevel());
        status.setGlassLevel(binStatusDTO.getGlassLevel());
        binStatusRepository.save(status);
    }

    public BinStatus updateLastEmptiedAt(String binId, BinStatusDTO binStatusDTO) {
        BinStatus status = binStatusRepository.findById(binId)
                .orElseThrow(() -> new BinStatusNotFoundException(binId));

        status.setLastEmptiedAt(binStatusDTO.getLastEmptiedAt());
        return binStatusRepository.save(status);
    }
}
