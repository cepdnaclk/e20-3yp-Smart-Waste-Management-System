package com.greenpulse.greenpulse_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.locationtech.jts.geom.Point;

import java.math.BigInteger;

@Entity
@Table(name = "route_stop")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RouteStop {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    @ManyToOne
    @JoinColumn(name = "bin_id", nullable = false)
    private BinStatus bin;

    @Column(name = "stop_order")
    private Long stopOrder;

    @Column(name="latitude", nullable = false)
    private Double latitude;

    @Column(name="longitude", nullable = false)
    private Double longitude;


}

