package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.dto.BinStatusDTO;
import com.greenpulse.greenpulse_backend.exception.BinStatusNotFoundException;
import com.greenpulse.greenpulse_backend.model.BinStatus;
import com.greenpulse.greenpulse_backend.repository.BinStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class BinStatusService {

    private final BinStatusRepository binStatusRepository;

    @Autowired
    public BinStatusService(
            BinStatusRepository binStatusRepository
    ) {
        this.binStatusRepository = binStatusRepository;
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
