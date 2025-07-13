package com.greenpulse.greenpulse_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class AssignRouteRequestDTO {
    private List<Long> stopIds;
    private Long routeId;
}
