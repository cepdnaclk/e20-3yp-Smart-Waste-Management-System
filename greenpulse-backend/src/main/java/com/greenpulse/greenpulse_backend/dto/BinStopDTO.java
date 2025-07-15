package com.greenpulse.greenpulse_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class BinStopDTO {
    private Long routeStopId;
    private Long stopOrder;
    private String binId;
    private Double latitude;
    private Double Longitude;
    private Long paperLevel;
    private Long plasticLevel;
    private Long glassLevel;
    private LocalDateTime lastEmptiedAt;
}
