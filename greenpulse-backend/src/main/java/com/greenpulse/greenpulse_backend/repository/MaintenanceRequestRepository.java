package com.greenpulse.greenpulse_backend.repository;

import com.greenpulse.greenpulse_backend.model.MaintenanceRequests;
import com.greenpulse.greenpulse_backend.enums.MaintenanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequests, UUID> {

    List<MaintenanceRequests> findByBinIdOrderByCreatedAtDesc(String binId);

    List<MaintenanceRequests> findByRequesterIdOrderByCreatedAtDesc(UUID requesterId);

    List<MaintenanceRequests> findByStatusOrderByCreatedAtDesc(MaintenanceStatus status);

    List<MaintenanceRequests> findByAssignedToOrderByCreatedAtDesc(UUID assignedTo);

    @Query("SELECT mr FROM MaintenanceRequests mr WHERE " +
            "(:status IS NULL OR mr.status = :status) " +
            "AND (:binId IS NULL OR mr.binId = :binId) " +
            "AND (:requesterId IS NULL OR mr.requesterId = :requesterId) " +
            "ORDER BY mr.createdAt DESC")
    Page<MaintenanceRequests> findWithFilters(
            @Param("status") MaintenanceStatus status,
            @Param("binId") String binId,
            @Param("requesterId") UUID requesterId,
            Pageable pageable);

    long countByStatusAndCreatedAtBetween(
            MaintenanceStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate);
}
