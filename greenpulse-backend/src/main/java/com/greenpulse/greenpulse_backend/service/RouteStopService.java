package com.greenpulse.greenpulse_backend.service;


import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.RouteStopDTO;
import com.greenpulse.greenpulse_backend.enums.RouteStatusEnum;
import com.greenpulse.greenpulse_backend.mapper.RouteStopMapper;
import com.greenpulse.greenpulse_backend.model.Route;
import com.greenpulse.greenpulse_backend.model.RouteStop;
import com.greenpulse.greenpulse_backend.repository.RouteRespository;
import com.greenpulse.greenpulse_backend.repository.RouteStopRepository;
import jakarta.persistence.EntityExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RouteStopService {


private RouteStopMapper routeStopMapper;
private RouteStopRepository routeStopRepository;
private RouteRespository routeRespository;

    @Autowired
    public RouteStopService(RouteStopRepository routeStopRepository,RouteStopMapper routeStopMapper,RouteRespository routeRespository) {
        this.routeStopRepository = routeStopRepository;
        this.routeStopMapper = routeStopMapper;
        this.routeRespository = routeRespository;
    };

//

    public ApiResponse<List<RouteStopDTO>> getAllRouteStops() {
        List<RouteStop> stops = routeStopRepository.findAll();
        List<RouteStopDTO> dtoList = stops.stream()
                .map(routeStopMapper::toDto)
                .collect(Collectors.toList());

        return ApiResponse.<List<RouteStopDTO>>builder()
                .success(true)
                .message("Route stops fetched successfully")
                .data(dtoList)
                .timestamp(LocalDateTime.now().toString())
                .build();
    }


    public ApiResponse<RouteStop> assignRouteToStops(List<Long> stopIds, Long routeId) {

        if (routeRespository.existsById(routeId)){
            throw new EntityExistsException("Route already exists!");
        }
        Route route1 = new Route();
        route1.setRouteId(routeId);
        route1.setStatus(RouteStatusEnum.CREATED);
        LocalDateTime dateTime=LocalDateTime.now();
        route1.setDateCreated(dateTime);

        routeRespository.save(route1);

        List<RouteStop> stops = routeStopRepository.findAllById(stopIds);
        for (RouteStop stop : stops) {
            stop.setRoute(route1);
        }
        routeStopRepository.saveAll(stops);
        return null;
    }
}
