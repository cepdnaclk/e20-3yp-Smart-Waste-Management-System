package com.greenpulse.greenpulse_backend.controller;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.AssignedRouteResponseDTO;
import com.greenpulse.greenpulse_backend.dto.MarkBinCollectedRequestDTO;
import com.greenpulse.greenpulse_backend.model.Route;
import com.greenpulse.greenpulse_backend.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;

    @Autowired
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    // Get assigned route for a collector
    @GetMapping("/assigned/{collectorId}")
    @PreAuthorize("hasRole('COLLECTOR')")
    public ResponseEntity<ApiResponse<AssignedRouteResponseDTO>> getAssignedRoute(@PathVariable UUID collectorId) {
        ApiResponse<AssignedRouteResponseDTO> response = routeService.getAssignedRoute(collectorId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Route>>> getAllRoutes() {
        ApiResponse<List<Route>> response = routeService.getAllRoutes();
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

//    @PostMapping
//    @PreAuthorize("hasAnyRole('ADMIN')")
//    public
//

    // Start a route
    @PostMapping("/{routeId}/start")
    @PreAuthorize("hasRole('COLLECTOR')")
    public ResponseEntity<ApiResponse<String>> startRoute(
            @PathVariable long routeId,
            @RequestParam UUID collectorId
    ) {
        ApiResponse<String> response = routeService.startRoute(collectorId, routeId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // Mark bin as collected
    @PostMapping("/mark-collected")
    @PreAuthorize("hasRole('COLLECTOR')")
    public ResponseEntity<ApiResponse<String>> markAsCollected(
            @RequestParam UUID collectorId,
            @RequestBody MarkBinCollectedRequestDTO request
    ) {
        ApiResponse<String> response = routeService.markAsCollected(collectorId, request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // Stop a route
    @PostMapping("/{routeId}/stop")
    @PreAuthorize("hasRole('COLLECTOR')")
    public ResponseEntity<ApiResponse<String>> stopRoute(
            @PathVariable long routeId,
            @RequestParam UUID collectorId
    ) {
        ApiResponse<String> response = routeService.stopRoute(collectorId, routeId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @PostMapping("/assign")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<String> assignRouteToCollector(@RequestParam String name, @RequestParam Long routeId) {
        return routeService.assignRouteToCollector(name, routeId);
    }

}