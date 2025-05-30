package com.greenpulse.greenpulse_backend.controller;

import com.greenpulse.greenpulse_backend.dto.AddTruckRequestDTO;
import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.ChangeTruckStatusRequestDTO;
import com.greenpulse.greenpulse_backend.enums.TruckStatusEnum;
import com.greenpulse.greenpulse_backend.model.TruckInventory;
import com.greenpulse.greenpulse_backend.service.TruckInventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/trucks")
public class TruckInventoryController {

    private final TruckInventoryService truckService;

    @Autowired
    public TruckInventoryController(TruckInventoryService truckService) {
        this.truckService = truckService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COLLECTOR')")
    public ApiResponse<List<TruckInventory>> getTrucks(
            @RequestParam(required = false) TruckStatusEnum status,
            @RequestParam(required = false) Long capacity
    ) {
        return truckService.getTrucksFiltered(status, capacity);
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<TruckInventory> addTruck(@Valid @RequestBody AddTruckRequestDTO request) {
        return truckService.addTruck(
                request.getRegistrationNumber(),
                request.getCapacity()
        );
    }

    @DeleteMapping("/{truckId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteTruck(@PathVariable Long truckId) {
        return truckService.deleteTruck(truckId);
    }

    @PutMapping("/{truckId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<TruckInventory> changeStatus(@PathVariable Long truckId,
                                                    @RequestBody ChangeTruckStatusRequestDTO request) {
        return truckService.changeStatus(truckId, request.getStatus());
    }
}
