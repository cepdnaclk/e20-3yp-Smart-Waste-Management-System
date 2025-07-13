package com.greenpulse.greenpulse_backend.controller;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.TruckAssignmentRequestDTO;
import com.greenpulse.greenpulse_backend.model.TruckAssignment;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.service.TruckAssignmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/collector/trucks")
public class TruckAssignmentController {

    private final TruckAssignmentService truckAssignmentService;

    @Autowired
    public TruckAssignmentController(TruckAssignmentService truckAssignmentService) {
        this.truckAssignmentService = truckAssignmentService;
    }

//    @GetMapping
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<ApiResponse<TruckAssignment>> getAllAssignedTrucks(){
//       ApiResponse<TruckAssignment> response=truckAssignmentService.getAllTrucksWithCollectors();
//        System.out.println(response);
//       return ResponseEntity.ok(response);
//    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TruckAssignment>>> getAllAssignedTrucks(){
        ApiResponse<List<TruckAssignment>> response = truckAssignmentService.getAllTrucksWithCollectors();
        System.out.println(response);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('COLLECTOR')")
    public ResponseEntity<ApiResponse<TruckAssignment>> assignTruck(@Valid @RequestBody TruckAssignmentRequestDTO request, @AuthenticationPrincipal UserTable user) {
        ApiResponse<TruckAssignment> response = truckAssignmentService.assignTruckToCollector(request.getRegistrationNumber(), user.getId());
        return ResponseEntity.ok(response);
    }

    // Endpoint to hand over a truck
    @PostMapping("/handover")
    @PreAuthorize("hasRole('COLLECTOR')")
    public ResponseEntity<ApiResponse<String>> handOverTruck(@Valid @RequestBody TruckAssignmentRequestDTO request, @AuthenticationPrincipal UserTable user) {
        ApiResponse<String> response = truckAssignmentService.handOverTruck(request.getRegistrationNumber(), user.getId());

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }

        if ("Truck not found".equals(response.getMessage())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

}
