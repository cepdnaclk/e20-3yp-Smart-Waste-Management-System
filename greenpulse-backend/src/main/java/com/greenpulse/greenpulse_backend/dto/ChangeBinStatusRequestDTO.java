package com.greenpulse.greenpulse_backend.dto;

import com.greenpulse.greenpulse_backend.enums.BinStatusEnum;

public class ChangeBinStatusRequestDTO {
    private BinStatusEnum status;

    public BinStatusEnum getStatus() {
        return status;
    }

    public void setStatus(BinStatusEnum status) {
        this.status = status;
    }
}
