package com.greenpulse.greenpulse_backend.mapper;

import com.greenpulse.greenpulse_backend.dto.RouteStopDTO;
import com.greenpulse.greenpulse_backend.model.BinStatus;
import com.greenpulse.greenpulse_backend.model.Route;
import com.greenpulse.greenpulse_backend.model.RouteStop;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Component;

@Component
public class RouteStopMapper {

    public RouteStopDTO toDto(RouteStop routeStop) {
        RouteStopDTO dto = new RouteStopDTO();
        dto.setId(routeStop.getId());
        dto.setStopOrder(routeStop.getStopOrder());
      dto.setLatitude(routeStop.getLatitude());
      dto.setLongitude(routeStop.getLongitude());
        if (routeStop.getRoute() != null) {
            dto.setRouteId(routeStop.getRoute().getRouteId());
        }

        if (routeStop.getBin() != null) {
            dto.setBinId(routeStop.getBin().getBinId());
        }

        return dto;
    }

    public RouteStop fromDto(RouteStopDTO dto) {
        RouteStop entity = new RouteStop();
        entity.setId(dto.getId());
        entity.setStopOrder(dto.getStopOrder());
        entity.setLatitude(dto.getLatitude());
        entity.setLongitude(dto.getLongitude());
        // You must set Route and Bin objects separately (not just IDs)
        if (dto.getRouteId() != 0) {
            Route route = new Route();
            route.setRouteId(dto.getRouteId());
            entity.setRoute(route);
        }

        if (dto.getBinId() != null) {
            BinStatus bin = new BinStatus();
            bin.setBinId(dto.getBinId());
            entity.setBin(bin);
        }
        return entity;
    }
}
