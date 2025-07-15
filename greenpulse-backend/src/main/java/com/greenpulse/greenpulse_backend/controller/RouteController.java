package com.greenpulse.greenpulse_backend.controller;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.AssignedRouteResponseDTO;
import com.greenpulse.greenpulse_backend.dto.MarkBinCollectedRequestDTO;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.model.Route;
import com.greenpulse.greenpulse_backend.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('COLLECTOR')")
    public ResponseEntity<ApiResponse<AssignedRouteResponseDTO>> getAssignedRoute(
            @AuthenticationPrincipal UserTable user
    ) {
        ApiResponse<AssignedRouteResponseDTO> response = routeService.getAssignedRoute(user.getId());
        return ResponseEntity.ok(response);
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
            @AuthenticationPrincipal UserTable user,
            @PathVariable Long routeId
    ) {
        ApiResponse<String> response = routeService.startRoute(user.getId(), routeId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/mark-collected")
    @PreAuthorize("hasRole('COLLECTOR')")
    public ResponseEntity<ApiResponse<String>> markAsCollected(
            @AuthenticationPrincipal UserTable user,
            @RequestBody MarkBinCollectedRequestDTO request
    ) {
        ApiResponse<String> response = routeService.markAsCollected(user.getId(), request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{routeId}/stop")
    @PreAuthorize("hasRole('COLLECTOR')")
    public ResponseEntity<ApiResponse<String>> stopRoute(
            @AuthenticationPrincipal UserTable user,
            @PathVariable Long routeId
    ) {
        ApiResponse<String> response = routeService.stopRoute(user.getId(), routeId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/assign")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<String> assignRouteToCollector(@RequestParam String name, @RequestParam Long routeId) {
        return routeService.assignRouteToCollector(name, routeId);
    }

}

