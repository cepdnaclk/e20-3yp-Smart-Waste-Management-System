package com.greenpulse.greenpulse_backend.dto;

import com.greenpulse.greenpulse_backend.enums.TruckStatusEnum;

public class ChangeTruckStatusRequestDTO {
    private TruckStatusEnum status;

    public TruckStatusEnum getStatus() {
        return status;
    }

    public void setStatus(TruckStatusEnum status) {
        this.status = status;
    }
}
