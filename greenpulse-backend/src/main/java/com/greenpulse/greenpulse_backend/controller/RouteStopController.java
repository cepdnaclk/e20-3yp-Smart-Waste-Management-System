package com.greenpulse.greenpulse_backend.controller;


import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.RouteStopDTO;
import com.greenpulse.greenpulse_backend.model.RouteStop;
import com.greenpulse.greenpulse_backend.service.RouteStopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/routeStops")
public class RouteStopController {

    private RouteStopService routeStopService;

    @Autowired
    public RouteStopController(RouteStopService routeStopService) {
        this.routeStopService = routeStopService;
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RouteStopDTO>>> getAllUsers() {
        ApiResponse<List<RouteStopDTO>> response = routeStopService.getAllRouteStops();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/assignRouteToStops")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RouteStop>> assignRouteToStops(@RequestBody List<Long> stopIds) {
        ApiResponse<RouteStop> response = routeStopService.assignRouteToStops(
                stopIds
        );
        return ResponseEntity.ok(response);
    }


}






