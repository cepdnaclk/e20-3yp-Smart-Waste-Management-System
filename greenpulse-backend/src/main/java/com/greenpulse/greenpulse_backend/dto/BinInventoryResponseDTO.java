package com.greenpulse.greenpulse_backend.dto;

import com.greenpulse.greenpulse_backend.enums.BinStatusEnum;
import lombok.Getter;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

import java.time.LocalDate;

@Getter
@Setter
public class BinInventoryResponseDTO {
    private String binId;
    private BinStatusEnum status;
    private LocalDate assignedDate;
    private Point location;
}
