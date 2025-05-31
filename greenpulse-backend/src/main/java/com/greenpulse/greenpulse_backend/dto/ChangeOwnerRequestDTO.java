package com.greenpulse.greenpulse_backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ChangeOwnerRequestDTO {
    @NotNull
    private UUID newOwnerId;
}
