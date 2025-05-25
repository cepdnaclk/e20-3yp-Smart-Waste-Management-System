package com.greenpulse.greenpulse_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "truck_assignment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TruckAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "collector_id", nullable = false)
    private CollectorProfile collector;

    @ManyToOne
    @JoinColumn(name = "truck_id", nullable = false)
    private TruckInventory truck;

    @Column(name = "assigned_date", nullable = false)
    private LocalDateTime assignedDate;
}

