package com.greenpulse.greenpulse_backend.model;

import com.greenpulse.greenpulse_backend.enums.TruckStatusEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "truck_inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TruckInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "truck_id", nullable = false)
    private Long truckId;

    @Column(name = "registration_number", nullable = false, unique = true)
    private String registrationNumber;

    @Column(name = "capacity_kg", nullable = false)
    private Long capacityKg;

    @Column(name = "last_maintenance")
    private LocalDate lastMaintenance;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TruckStatusEnum status;
}

