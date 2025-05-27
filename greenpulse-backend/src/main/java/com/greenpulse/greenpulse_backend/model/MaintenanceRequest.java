package com.greenpulse.greenpulse_backend.model;

import com.greenpulse.greenpulse_backend.enums.MaintenanceStatusEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "maintenance_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserTable user;

    @ManyToOne
    @JoinColumn(name = "bin_id", nullable = false)
    private BinInventory bin;

    @Column(name = "sorting_malfunction", nullable = false)
    private Boolean sortingMalfunction;

    @Column(name = "bin_status_malfuntion", nullable = false)
    private Boolean binStatusMalfunction;

    @Column(name = "gps_malfunction", nullable = false)
    private Boolean gpsMalfunction;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_status", nullable = false)
    private MaintenanceStatusEnum maintenanceStatus;
}

