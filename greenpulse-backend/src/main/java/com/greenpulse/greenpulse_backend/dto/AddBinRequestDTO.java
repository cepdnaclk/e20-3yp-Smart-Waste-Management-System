package com.greenpulse.greenpulse_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddBinRequestDTO {
    @NotBlank(message = "Bin ID must not be blank")
    private String binId;
}
