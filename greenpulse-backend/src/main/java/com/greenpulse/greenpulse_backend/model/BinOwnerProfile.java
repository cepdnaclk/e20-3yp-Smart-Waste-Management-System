package com.greenpulse.greenpulse_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bin_owner_profile")
public class BinOwnerProfile {
    @Id
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @MapsId
    @OneToOne
    @JoinColumn(name = "user_id")
    private UserTable user;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "mobile_number", nullable = false)
    private String mobileNumber;

    @Column(name = "is_email_verified", nullable = false)
    private boolean isEmailVerified;
}
