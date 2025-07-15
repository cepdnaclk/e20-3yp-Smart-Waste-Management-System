package com.greenpulse.greenpulse_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMaintenanceRequestDTO {
    @NotBlank(message = "Bin ID is required")
    private String binId;

    @NotBlank(message = "Request type is required")
    private String requestType;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
    private String description;

    private String priority = "MEDIUM";
    private String notes;
}
