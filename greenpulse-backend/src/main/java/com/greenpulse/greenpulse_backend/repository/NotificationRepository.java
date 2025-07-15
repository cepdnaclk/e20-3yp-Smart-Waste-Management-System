package com.greenpulse.greenpulse_backend.repository;

import com.greenpulse.greenpulse_backend.model.Notification;
import com.greenpulse.greenpulse_backend.enums.NotificationType;
import com.greenpulse.greenpulse_backend.enums.UserRoleEnum;
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
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByRecipientIdAndRecipientTypeOrderByCreatedAtDesc(
            UUID recipientId, UserRoleEnum recipientType);

    long countByRecipientIdAndRecipientTypeAndIsReadFalse(
            UUID recipientId, UserRoleEnum recipientType);

    List<Notification> findByRecipientIdAndRecipientTypeAndIsReadFalse(
            UUID recipientId, UserRoleEnum recipientType);

    List<Notification> findByExpiresAtBeforeAndIsReadFalse(LocalDateTime expiredDate);

    @Query("SELECT n FROM Notification n WHERE n.recipientId = :recipientId " +
            "AND n.recipientType = :recipientType " +
            "AND (:isRead IS NULL OR n.isRead = :isRead) " +
            "AND (:notificationType IS NULL OR n.notificationType = :notificationType) " +
            "AND (:priority IS NULL OR n.priority = :priority) " +
            "ORDER BY n.createdAt DESC")
    Page<Notification> findNotificationsWithFilters(
            @Param("recipientId") UUID recipientId,
            @Param("recipientType") UserRoleEnum recipientType,
            @Param("isRead") Boolean isRead,
            @Param("notificationType") NotificationType notificationType,
            @Param("priority") String priority,
            Pageable pageable);

    List<Notification> findByBinIdAndNotificationType(String binId, NotificationType notificationType);

    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
            "AND n.createdAt >= :startDate AND n.createdAt <= :endDate")
    List<Notification> findByRecipientTypeAndDateRange(
            @Param("recipientType") UserRoleEnum recipientType,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
