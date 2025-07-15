package com.greenpulse.greenpulse_backend.controller;

import com.greenpulse.greenpulse_backend.dto.*;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.enums.MaintenanceStatus;
import com.greenpulse.greenpulse_backend.service.MaintenanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/maintenance-requests")
@RequiredArgsConstructor
public class MaintenanceRequestController {

    private final MaintenanceRequestService maintenanceRequestService;

    @PostMapping
    public ResponseEntity<ApiResponse<UUID>> createMaintenanceRequest(
            @Valid @RequestBody CreateMaintenanceRequestDTO request,
            @AuthenticationPrincipal UserTable user) {

        UUID requestId = maintenanceRequestService.createRequest(request, user.getId());

        return ResponseEntity.ok(ApiResponse.<UUID>builder()
                .success(true)
                .message("Maintenance request created successfully")
                .data(requestId)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<MaintenanceRequestDTO>>> getMaintenanceRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String binId,
            @RequestParam(required = false) UUID requesterId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserTable user) {

        MaintenanceStatus statusEnum = null;
        if (status != null) {
            try {
                statusEnum = MaintenanceStatus.valueOf(status);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.<Page<MaintenanceRequestDTO>>builder()
                                .success(false)
                                .message("Invalid status value")
                                .timestamp(LocalDateTime.now().toString())
                                .build());
            }
        }

        Page<MaintenanceRequestDTO> requests = maintenanceRequestService
                .getRequestsWithFilters(statusEnum, binId, requesterId, page, size);

        return ResponseEntity.ok(ApiResponse.<Page<MaintenanceRequestDTO>>builder()
                .success(true)
                .message("Maintenance requests retrieved successfully")
                .data(requests)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<ApiResponse<MaintenanceRequestDTO>> getMaintenanceRequest(
            @PathVariable UUID requestId) {

        MaintenanceRequestDTO request = maintenanceRequestService.getRequestById(requestId);

        return ResponseEntity.ok(ApiResponse.<MaintenanceRequestDTO>builder()
                .success(true)
                .message("Maintenance request retrieved successfully")
                .data(request)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/my-requests")
    public ResponseEntity<ApiResponse<List<MaintenanceRequestDTO>>> getMyRequests(
            @AuthenticationPrincipal UserTable user) {

        List<MaintenanceRequestDTO> requests = maintenanceRequestService
                .getRequestsByRequester(user.getId());

        return ResponseEntity.ok(ApiResponse.<List<MaintenanceRequestDTO>>builder()
                .success(true)
                .message("Your maintenance requests retrieved successfully")
                .data(requests)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/bin/{binId}")
    public ResponseEntity<ApiResponse<List<MaintenanceRequestDTO>>> getRequestsByBin(
            @PathVariable String binId) {

        List<MaintenanceRequestDTO> requests = maintenanceRequestService.getRequestsByBin(binId);

        return ResponseEntity.ok(ApiResponse.<List<MaintenanceRequestDTO>>builder()
                .success(true)
                .message("Maintenance requests for bin retrieved successfully")
                .data(requests)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PutMapping("/{requestId}/status")
    public ResponseEntity<ApiResponse<Object>> updateRequestStatus(
            @PathVariable UUID requestId,
            @RequestParam String status,
            @RequestParam(required = false) UUID assignedTo,
            @RequestParam(required = false) String notes) {

        try {
            MaintenanceStatus statusEnum = MaintenanceStatus.valueOf(status);
            maintenanceRequestService.updateRequestStatus(requestId, statusEnum, assignedTo, notes);

            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .message("Maintenance request status updated successfully")
                    .timestamp(LocalDateTime.now().toString())
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.builder()
                            .success(false)
                            .message("Invalid status value")
                            .timestamp(LocalDateTime.now().toString())
                            .build());
        }
    }
}
