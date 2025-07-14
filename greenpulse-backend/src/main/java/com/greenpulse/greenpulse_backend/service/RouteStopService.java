package com.greenpulse.greenpulse_backend.service;


import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.RouteStopDTO;
import com.greenpulse.greenpulse_backend.enums.RouteStatusEnum;
import com.greenpulse.greenpulse_backend.mapper.RouteStopMapper;
import com.greenpulse.greenpulse_backend.model.BinStatus;
import com.greenpulse.greenpulse_backend.model.Route;
import com.greenpulse.greenpulse_backend.model.RouteStop;
import com.greenpulse.greenpulse_backend.repository.BinStatusRepository;
import com.greenpulse.greenpulse_backend.repository.RouteRespository;
import com.greenpulse.greenpulse_backend.repository.RouteStopRepository;
import jakarta.persistence.EntityExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RouteStopService {


private RouteStopMapper routeStopMapper;
private RouteStopRepository routeStopRepository;
private RouteRespository routeRespository;
private BinStatusRepository binStatusRepository;

    @Autowired
    public RouteStopService(RouteStopRepository routeStopRepository,
                            RouteStopMapper routeStopMapper,
                            RouteRespository routeRespository,
                            BinStatusRepository binStatusRepository) {
        this.routeStopRepository = routeStopRepository;
        this.routeStopMapper = routeStopMapper;
        this.routeRespository = routeRespository;
        this.binStatusRepository = binStatusRepository;
    }

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
    
    @Scheduled(fixedRate = 60000) // every 10 seconds for testing
    public void updateRouteStops() {
        System.out.println("[updateRouteStops] Scheduled task started at " + LocalDateTime.now());

        List<BinStatus> fullBins = binStatusRepository.findBinsWithHighFillLevel(90L);
        System.out.println("[updateRouteStops] Full bins count: " + fullBins.size());

        for (BinStatus bin : fullBins) {
            System.out.println("[updateRouteStops] Checking binId: " + bin.getBinId());

            boolean exists = routeStopRepository.existsRouteStopByBin_BinId(bin.getBinId());

            if (!exists) {
                System.out.println("[updateRouteStops] New RouteStop added for binId: " + bin.getBinId());
                RouteStop stop = new RouteStop();
                stop.setBin(bin); // Ensure you're passing the BinInventory here
                stop.setLatitude(bin.getBin().getLatitude());
                stop.setLongitude(bin.getBin().getLongitude());
                routeStopRepository.save(stop);
            } else {
                System.out.println("[updateRouteStops] RouteStop already exists for binId: " + bin.getBinId());
            }
        }
    }

}







