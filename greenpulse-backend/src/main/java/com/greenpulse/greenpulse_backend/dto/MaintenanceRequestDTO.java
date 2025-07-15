package com.greenpulse.greenpulse_backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRequestDTO {
    private UUID id;
    private String binId;
    private UUID requesterId;
    private String requesterName;
    private String requestType;
    private String description;
    private String priority;
    private String status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime resolvedAt;

    private UUID assignedTo;
    private String assignedToName;
    private String notes;
}