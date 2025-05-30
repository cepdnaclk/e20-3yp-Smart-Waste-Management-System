package com.greenpulse.greenpulse_backend.controller;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.CollectorCreateRequestDTO;
import com.greenpulse.greenpulse_backend.service.CollectorManagementService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/collectors")
@PreAuthorize("hasRole('ADMIN')")
public class CollectorManagementController {

    private final CollectorManagementService collectorService;

    public CollectorManagementController(CollectorManagementService collectorService) {
        this.collectorService = collectorService;
    }

    @PostMapping
    public ApiResponse<String> createCollector(
            @RequestBody @Valid CollectorCreateRequestDTO request) {
        return collectorService.createCollector(request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCollector(@PathVariable UUID id) {
        System.out.println("id" + id);
        ApiResponse<String> response = collectorService.deleteCollector(id);
        return ResponseEntity.ok(response);
    }
}
