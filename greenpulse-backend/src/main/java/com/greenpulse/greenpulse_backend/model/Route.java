package com.greenpulse.greenpulse_backend.model;

import com.greenpulse.greenpulse_backend.enums.RouteStatusEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "route")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_id", nullable = false)
    private Long routeId;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private CollectorProfile assignedTo;

    @Column(name = "date_created", nullable = false)
    private LocalDateTime dateCreated;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RouteStatusEnum status;

    @Column(name = "route_start_time")
    private LocalDateTime routeStartTime;

    @Column(name = "route_end_time")
    private LocalDateTime routeEndTime;
}

