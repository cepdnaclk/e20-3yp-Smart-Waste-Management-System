package com.greenpulse.greenpulse_backend.dto;

import com.greenpulse.greenpulse_backend.enums.RouteStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignedRouteResponseDTO {
    private Long routeId;
    private RouteStatusEnum status;
    private LocalDateTime routeStartTime;
    private LocalDateTime routeEndTime;
    private List<BinStopDTO> binStops;
}
