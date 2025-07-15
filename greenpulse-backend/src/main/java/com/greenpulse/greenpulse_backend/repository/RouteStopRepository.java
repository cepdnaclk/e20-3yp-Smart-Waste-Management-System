package com.greenpulse.greenpulse_backend.repository;

import com.greenpulse.greenpulse_backend.model.Route;
import com.greenpulse.greenpulse_backend.model.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteStopRepository extends JpaRepository<RouteStop,Long> {
    List<RouteStop> findByRoute(Route route);

    boolean existsByRoute_RouteIdAndBin_BinId(long routeId, String binId);

    boolean existsRouteStopByBin_BinId(String binId);
}
