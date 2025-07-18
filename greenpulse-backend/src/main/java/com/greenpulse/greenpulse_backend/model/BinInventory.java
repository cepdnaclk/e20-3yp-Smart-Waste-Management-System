package com.greenpulse.greenpulse_backend.model;

import com.greenpulse.greenpulse_backend.enums.BinStatusEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bin_inventory")
public class BinInventory {
    @Id
    @Column(name = "bin_id", nullable = false)
    private String binId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BinStatusEnum status;

    @ManyToOne
    @JoinColumn(name = "owner")
    private BinOwnerProfile owner;

    @Column(name = "assigned_date")
    private LocalDate assignedDate;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;



    @OneToOne(mappedBy = "bin", cascade = CascadeType.ALL, orphanRemoval = true)
    private BinStatus binStatus;

    public void assignToOwner(BinOwnerProfile newOwner) {
        this.owner = newOwner;
        this.status = BinStatusEnum.ASSIGNED;
        this.assignedDate = LocalDate.now();
    }
}

