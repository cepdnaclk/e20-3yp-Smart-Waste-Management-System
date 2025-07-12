package com.greenpulse.greenpulse_backend.dto;

import com.greenpulse.greenpulse_backend.enums.RouteStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class AssignedRouteResponseDTO {
    private Long routeId;
    private RouteStatusEnum routeStatus;
    private LocalDateTime routeStartTime;
    private LocalDateTime routeEndTime;
    private List<BinStopDTO> stops;
    
}
