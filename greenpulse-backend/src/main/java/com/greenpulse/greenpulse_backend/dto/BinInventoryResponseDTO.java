package com.greenpulse.greenpulse_backend.dto;

import com.greenpulse.greenpulse_backend.enums.BinStatusEnum;
import com.greenpulse.greenpulse_backend.model.BinOwnerProfile;
import lombok.Getter;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class BinInventoryResponseDTO {
    private String binId;
    private BinStatusEnum status;
    private LocalDate assignedDate;
    private double latitude;
    private double longitude;
}
