package com.greenpulse.greenpulse_backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TruckAssignmentRequestDTO {
    @NotNull
    private String registrationNumber;
}
