package com.greenpulse.greenpulse_backend.model;


import com.greenpulse.greenpulse_backend.enums.MaintenanceStatus;
import com.greenpulse.greenpulse_backend.enums.Priority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "maintenance_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRequests {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "bin_id", nullable = false)
    private String binId;

    @Column(name = "requester_id", nullable = false)
    private UUID requesterId;

    @Column(name = "request_type", nullable = false)
    private String requestType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MaintenanceStatus status = MaintenanceStatus.PENDING;

    @Builder.Default
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "assigned_to")
    private UUID assignedTo;
}