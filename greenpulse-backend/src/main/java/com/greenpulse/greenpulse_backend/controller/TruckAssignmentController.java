package com.greenpulse.greenpulse_backend.controller;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.TruckAssignmentRequestDTO;
import com.greenpulse.greenpulse_backend.model.TruckAssignment;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.service.TruckAssignmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/collector/trucks")
public class TruckAssignmentController {

    private final TruckAssignmentService truckAssignmentService;

    @Autowired
    public TruckAssignmentController(TruckAssignmentService truckAssignmentService) {
        this.truckAssignmentService = truckAssignmentService;
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('COLLECTOR')")
    public ResponseEntity<ApiResponse<TruckAssignment>> assignTruck(@Valid @RequestBody TruckAssignmentRequestDTO request, @AuthenticationPrincipal UserTable user) {
        ApiResponse<TruckAssignment> response = truckAssignmentService.assignTruckToCollector(request.getRegistrationNumber(), user.getId());
        return ResponseEntity.ok(response);
    }
}
