package com.greenpulse.greenpulse_backend.controller;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.BinInventoryResponseDTO;
import com.greenpulse.greenpulse_backend.dto.BinStatusDTO;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.service.BinStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bin/status")
public class BinStatusController {
    private final BinStatusService binStatusService;

    @Autowired
    public BinStatusController(BinStatusService binStatusService) {
        this.binStatusService = binStatusService;
    }

    @GetMapping("/fetch/{binId}")
    @PreAuthorize("hasRole('BIN_OWNER')")
    public ApiResponse<BinStatusDTO> getBinStatus(@PathVariable String binId, @AuthenticationPrincipal UserTable userTable) {
        return binStatusService.getBinStatus(binId, userTable.getId());
    }

}
