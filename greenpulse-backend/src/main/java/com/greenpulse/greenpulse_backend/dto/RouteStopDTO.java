package com.greenpulse.greenpulse_backend.dto;

import lombok.Getter;
import lombok.Setter;
import org.locationtech.jts.geom.Point;


@Getter
@Setter
public class RouteStopDTO {
        private Long id;
        private Long routeId;
        private String binId;
        private Long stopOrder;


        private Double latitude;
        private Double longitude;

}





