package com.greenpulse.greenpulse_backend.model;

import com.greenpulse.greenpulse_backend.enums.MaintenanceStatusEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bin_status")
public class BinStatus {
    @Id
    @Column(name = "bin_id", nullable = false)
    private String binId;

    @OneToOne
    @JoinColumn(name = "bin_id")
    @MapsId
    private BinInventory bin;

    @Column(name = "plastic_level", nullable = false)
    private Long plasticLevel;

    @Column(name = "paper_level", nullable = false)
    private Long paperLevel;

    @Column(name = "glass_level", nullable = false)
    private Long glassLevel;

    @Column(name = "last_emptied_at", nullable = false)
    private LocalDateTime lastEmptiedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_status", nullable = false)
    private MaintenanceStatusEnum maintenanceStatus;
}

