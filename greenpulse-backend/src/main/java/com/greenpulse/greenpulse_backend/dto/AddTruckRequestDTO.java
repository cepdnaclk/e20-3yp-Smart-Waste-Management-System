package com.greenpulse.greenpulse_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddTruckRequestDTO {
    @NotBlank(message = "Registration number must not be blank")
    private String registrationNumber;

    @NotBlank(message = "capacity must not be blank")
    private long capacity;
}
