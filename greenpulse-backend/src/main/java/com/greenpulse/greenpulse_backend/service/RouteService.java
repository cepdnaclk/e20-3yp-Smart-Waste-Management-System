package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.AssignedRouteResponseDTO;
import com.greenpulse.greenpulse_backend.dto.BinStopDTO;
import com.greenpulse.greenpulse_backend.dto.MarkBinCollectedRequestDTO;
import com.greenpulse.greenpulse_backend.enums.RouteStatusEnum;
import com.greenpulse.greenpulse_backend.model.BinStatus;
import com.greenpulse.greenpulse_backend.model.CollectorProfile;
import com.greenpulse.greenpulse_backend.model.Route;
import com.greenpulse.greenpulse_backend.repository.BinStatusRepository;
import com.greenpulse.greenpulse_backend.repository.CollectorProfileRepository;
import com.greenpulse.greenpulse_backend.repository.RouteRepository;
import com.greenpulse.greenpulse_backend.repository.RouteStopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;
    private final BinStatusRepository binStatusRepository;
    private final CollectorProfileRepository collectorProfileRepository;

    @Autowired
    public RouteService(
            RouteRepository routeRepository,
            RouteStopRepository routeStopRepository,
            BinStatusRepository binStatusRepository,
            CollectorProfileRepository collectorProfileRepository) {
        this.routeRepository = routeRepository;
        this.routeStopRepository = routeStopRepository;
        this.binStatusRepository = binStatusRepository;
        this.collectorProfileRepository = collectorProfileRepository;
    }

    public ApiResponse<AssignedRouteResponseDTO> getAssignedRoute(UUID collectorId) {
        Optional<CollectorProfile> optionalCollectorProfile = collectorProfileRepository.findById(collectorId);
        if (optionalCollectorProfile.isEmpty()) {
            return new ApiResponse<>(false,"Collector not found",null,LocalDateTime.now().toString());
        }
        CollectorProfile collectorProfile = optionalCollectorProfile.get();
        Optional<Route> optionalRoute = routeRepository.findFirstByAssignedToAndStatusOrderByDateCreatedDesc(collectorProfile, RouteStatusEnum.ASSIGNED);

        if (optionalRoute.isEmpty()) {
            return new ApiResponse<>(
                    false,
                    "No assigned route found for the collector",
                    null,
                    LocalDateTime.now().toString()
            );
        }

        Route route = optionalRoute.get();
        List<BinStopDTO> binStops = routeStopRepository.findByRoute(route)
                .stream()
                .map(stop -> {
                    BinStatus status = stop.getBin();

                    return new BinStopDTO(
                            stop.getId(),
                            stop.getStopOrder(),
                            status.getBinId(),
                            stop.getLatitude(),
                            stop.getLongitude(),
                            status.getPaperLevel(),
                            status.getPlasticLevel(),
                            status.getGlassLevel(),
                            status.getLastEmptiedAt()
                    );
                })
                .toList();


        AssignedRouteResponseDTO responseDTO = new AssignedRouteResponseDTO(
                route.getRouteId(),
                route.getStatus(),
                route.getRouteStartTime(),
                route.getRouteEndTime(),
                binStops
        );

        return new ApiResponse<>(
                true,
                "Assigned route retrieved successfully",
                responseDTO,
                LocalDateTime.now().toString()
        );
    }

    public ApiResponse<String> startRoute(UUID collectorId, long routeId) {
        Optional<Route> optionalRoute = routeRepository.findById(routeId);
        if (optionalRoute.isEmpty()) {
            return new ApiResponse<>(false, "Route not found", null, LocalDateTime.now().toString());
        }

        Route route = optionalRoute.get();
        if (!route.getAssignedTo().getUserId().equals(collectorId)) {
            return new ApiResponse<>(false, "You are not authorized to start this route", null, LocalDateTime.now().toString());
        }

        if (!route.getStatus().equals(RouteStatusEnum.ASSIGNED)) {
            return new ApiResponse<>(false, "Route is not in a valid state to be started", null, LocalDateTime.now().toString());
        }
        route.setStatus(RouteStatusEnum.IN_PROGRESS);
        route.setRouteStartTime(LocalDateTime.now());
        routeRepository.save(route);

        return new ApiResponse<>(true, "Successfully updated the Started time", null, LocalDateTime.now().toString()
        );
    }

    public ApiResponse<String> markAsCollected(UUID collectorId, MarkBinCollectedRequestDTO request) {
        Optional<Route> optionalRoute = routeRepository.findById(request.getRouteId());
        if (optionalRoute.isEmpty()) {
            return new ApiResponse<>(false, "Route not found", null, LocalDateTime.now().toString());
        }

        Route route = optionalRoute.get();
        if(!route.getAssignedTo().getUserId().equals(collectorId)) {
            return new ApiResponse<>(false, "You are not authorized", null, LocalDateTime.now().toString());
        }
        if (!route.getStatus().equals(RouteStatusEnum.IN_PROGRESS)) {
            return new ApiResponse<>(false, "Cannot collect bin: Route is not ongoing", null, LocalDateTime.now().toString());
        }
        boolean binInRoute = routeStopRepository.existsByRoute_RouteIdAndBin_BinId(route.getRouteId(), request.getBinId());
        if (!binInRoute) {
            return new ApiResponse<>(false, "Bin is not part of this route", null, LocalDateTime.now().toString());
        }
        var binStatus = binStatusRepository.findByBinId(request.getBinId())
                .orElseThrow(() -> new RuntimeException("Bin status not found"));

        binStatus.setPaperLevel(0L);
        binStatus.setPlasticLevel(0L);
        binStatus.setGlassLevel(0L);
        binStatus.setLastEmptiedAt(LocalDateTime.now());

        binStatusRepository.save(binStatus);

        return new ApiResponse<>(true, "Bin marked as collected", null, LocalDateTime.now().toString());
    }

    public ApiResponse<String> stopRoute(UUID collectorId, long routeId) {
        Optional<Route> optionalRoute = routeRepository.findById(routeId);
        if (optionalRoute.isEmpty()) {
            return new ApiResponse<>(false, "Route not found", null, LocalDateTime.now().toString());
        }
        Route route = optionalRoute.get();

        if(!route.getAssignedTo().getUserId().equals(collectorId)) {
            return new ApiResponse<>(false, "You are not authorized to stop this route", null, LocalDateTime.now().toString());
        }

        if (!route.getStatus().equals(RouteStatusEnum.IN_PROGRESS)) {
            return new ApiResponse<>(false, "Cannot stop this route", null, LocalDateTime.now().toString());
        }
        route.setStatus(RouteStatusEnum.COMPLETED);
        route.setRouteEndTime(LocalDateTime.now());
        routeRepository.save(route);
        return new ApiResponse<>(true, "Route completed successfully", null, LocalDateTime.now().toString());
    }
    
}
