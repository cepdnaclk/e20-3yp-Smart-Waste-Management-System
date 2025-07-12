package com.greenpulse.greenpulse_backend.repository;

import com.greenpulse.greenpulse_backend.model.Route;
import com.greenpulse.greenpulse_backend.model.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findFirstByAssignedToAndStatusInOrderByDateCreatedDesc(UUID id, String status);

}
