// NotificationService.java
package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.dto.*;
import com.greenpulse.greenpulse_backend.enums.MaintenanceStatus;
import com.greenpulse.greenpulse_backend.model.MaintenanceRequest;
import com.greenpulse.greenpulse_backend.model.Notification;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.enums.NotificationType;
import com.greenpulse.greenpulse_backend.enums.Priority;
import com.greenpulse.greenpulse_backend.enums.UserRoleEnum;
import com.greenpulse.greenpulse_backend.repository.MaintenanceRequestRepository;
import com.greenpulse.greenpulse_backend.repository.NotificationRepository;
import com.greenpulse.greenpulse_backend.repository.UserTableRepository;
import com.greenpulse.greenpulse_backend.websocket.NotificationWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserTableRepository userTableRepository;
    private final NotificationWebSocketHandler webSocketHandler;

    // Create notification for high fill level
    public void createFillLevelNotification(String binId, int fillLevel, UUID binOwnerId) {
        if (fillLevel >= 90) {
            Map<String, Object> metadata = Map.of(
                    "fill_level", fillLevel,
                    "threshold", 90,
                    "alert_type", "HIGH_FILL_LEVEL"
            );

            // Check if similar notification already exists
            List<Notification> existingNotifications = notificationRepository
                    .findByBinIdAndNotificationType(binId, NotificationType.FILL_LEVEL_HIGH);

            boolean hasUnreadHighFillNotification = existingNotifications.stream()
                    .anyMatch(n -> !n.getIsRead() && n.getCreatedAt().isAfter(LocalDateTime.now().minusHours(24)));

            if (!hasUnreadHighFillNotification) {
                // Notification for bin owner
                Notification binOwnerNotification = createNotification(
                        NotificationType.FILL_LEVEL_HIGH,
                        "Bin Almost Full",
                        String.format("Your bin %s is %d%% full and needs collection", binId, fillLevel),
                        UserRoleEnum.ROLE_BIN_OWNER, // Using your existing enum
                        binOwnerId,
                        binId,
                        Priority.HIGH,
                        metadata,
                        LocalDateTime.now().plusDays(7)
                );

                notificationRepository.save(binOwnerNotification);
                sendRealTimeNotification(binOwnerId.toString(), convertToDTO(binOwnerNotification));

                // Notification for admins
                List<UserTable> admins = userTableRepository.findByRole_Role(UserRoleEnum.ROLE_ADMIN);
                for (UserTable admin : admins) {
                    Notification adminNotification = createNotification(
                            NotificationType.FILL_LEVEL_HIGH,
                            "High Fill Level Alert",
                            String.format("Bin %s has reached %d%% capacity", binId, fillLevel),
                            UserRoleEnum.ROLE_ADMIN, // Using your existing enum
                            admin.getId(),
                            binId,
                            Priority.HIGH,
                            metadata,
                            LocalDateTime.now().plusDays(7)
                    );

                    notificationRepository.save(adminNotification);
                    sendRealTimeNotification(admin.getId().toString(), convertToDTO(adminNotification));
                }
            }
        }
    }

    // Create maintenance request notification
    public void createMaintenanceRequestNotification(UUID maintenanceRequestId, String binId,
                                                     String description, UUID requesterId) {
        List<UserTable> admins = userTableRepository.findByRole_Role(UserRoleEnum.ROLE_ADMIN);

        Map<String, Object> metadata = Map.of(
                "requester_id", requesterId,
                "description", description,
                "request_type", "MAINTENANCE"
        );

        for (UserTable admin : admins) {
            Notification notification = createNotification(
                    NotificationType.MAINTENANCE_REQUEST,
                    "New Maintenance Request",
                    String.format("Maintenance request for bin %s: %s", binId, description),
                    UserRoleEnum.ROLE_ADMIN, // Using your existing enum
                    admin.getId(),
                    binId,
                    Priority.MEDIUM,
                    metadata,
                    null
            );
            notification.setMaintenanceRequestId(maintenanceRequestId);

            notificationRepository.save(notification);
            sendRealTimeNotification(admin.getId().toString(), convertToDTO(notification));
        }
    }

    // Create collection date notification
    public void createCollectionDateNotification(String binId, UUID binOwnerId, LocalDate collectionDate) {
        Map<String, Object> metadata = Map.of(
                "collection_date", collectionDate.toString(),
                "notification_type", "COLLECTION_REMINDER"
        );

        Notification notification = createNotification(
                NotificationType.COLLECTION_DATE,
                "Collection Scheduled",
                String.format("Your bin %s is scheduled for collection on %s", binId, collectionDate),
                UserRoleEnum.ROLE_BIN_OWNER, // Using your existing enum
                binOwnerId,
                binId,
                Priority.MEDIUM,
                metadata,
                collectionDate.atTime(23, 59)
        );

        notificationRepository.save(notification);
        sendRealTimeNotification(binOwnerId.toString(), convertToDTO(notification));
    }

    // Create maintenance completed notification
    public void createMaintenanceCompletedNotification(UUID maintenanceRequestId, String binId,
                                                       UUID requesterId, String resolution) {
        Map<String, Object> metadata = Map.of(
                "resolution", resolution,
                "completion_status", "RESOLVED"
        );

        Notification notification = createNotification(
                NotificationType.MAINTENANCE_COMPLETED,
                "Maintenance Completed",
                String.format("Maintenance request for bin %s has been completed. Resolution: %s", binId, resolution),
                UserRoleEnum.ROLE_BIN_OWNER, // Using your existing enum
                requesterId,
                binId,
                Priority.LOW,
                metadata,
                null
        );
        notification.setMaintenanceRequestId(maintenanceRequestId);

        notificationRepository.save(notification);
        sendRealTimeNotification(requesterId.toString(), convertToDTO(notification));
    }

    // Get notifications for user with pagination and filters
    public Page<NotificationDTO> getNotificationsWithFilters(UUID userId, UserRoleEnum userRole,
                                                             NotificationFilterDTO filter) {
        Sort sort = Sort.by(Sort.Direction.fromString(filter.getSortDirection()), filter.getSortBy());
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

        NotificationType notificationType = null;
        if (filter.getNotificationType() != null) {
            try {
                notificationType = NotificationType.valueOf(filter.getNotificationType());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid notification type: {}", filter.getNotificationType());
            }
        }

        Page<Notification> notifications = notificationRepository.findNotificationsWithFilters(
                userId, userRole, filter.getIsRead(), notificationType, filter.getPriority(), pageable);

        return notifications.map(this::convertToDTO);
    }

    // Get notifications for user (simple version)
    public List<NotificationDTO> getNotificationsForUser(UUID userId, UserRoleEnum userRole) {
        List<Notification> notifications = notificationRepository
                .findByRecipientIdAndRecipientTypeOrderByCreatedAtDesc(userId, userRole);

        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Mark notification as read
    public void markAsRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getRecipientId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to notification");
        }

        if (!notification.getIsRead()) {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }

    // Mark all notifications as read
    public void markAllAsRead(UUID userId, UserRoleEnum userRole) {
        List<Notification> unreadNotifications = notificationRepository
                .findByRecipientIdAndRecipientTypeAndIsReadFalse(userId, userRole);

        unreadNotifications.forEach(notification -> {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
        });

        notificationRepository.saveAll(unreadNotifications);
    }

    // Get unread count
    public long getUnreadCount(UUID userId, UserRoleEnum userRole) {
        return notificationRepository.countByRecipientIdAndRecipientTypeAndIsReadFalse(userId, userRole);
    }

    // Get notification statistics
    public NotificationStatsDTO getNotificationStats(UUID userId, UserRoleEnum userRole) {
        List<Notification> allNotifications = notificationRepository
                .findByRecipientIdAndRecipientTypeOrderByCreatedAtDesc(userId, userRole);

        long total = allNotifications.size();
        long unread = allNotifications.stream().mapToLong(n -> n.getIsRead() ? 0 : 1).sum();
        long highPriority = allNotifications.stream()
                .mapToLong(n -> n.getPriority() == Priority.HIGH || n.getPriority() == Priority.URGENT ? 1 : 0).sum();

        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime weekStart = LocalDate.now().minusDays(7).atStartOfDay();

        long today = allNotifications.stream()
                .mapToLong(n -> n.getCreatedAt().isAfter(todayStart) ? 1 : 0).sum();
        long week = allNotifications.stream()
                .mapToLong(n -> n.getCreatedAt().isAfter(weekStart) ? 1 : 0).sum();

        return NotificationStatsDTO.builder()
                .totalNotifications(total)
                .unreadNotifications(unread)
                .highPriorityNotifications(highPriority)
                .todayNotifications(today)
                .weekNotifications(week)
                .build();
    }

    // Delete notifications
    public void deleteNotifications(List<UUID> notificationIds, UUID userId) {
        List<Notification> notifications = notificationRepository.findAllById(notificationIds);

        // Verify ownership
        notifications.forEach(notification -> {
            if (!notification.getRecipientId().equals(userId)) {
                throw new RuntimeException("Unauthorized access to notification");
            }
        });

        notificationRepository.deleteAll(notifications);
    }

    // Scheduled cleanup of expired notifications
    @Scheduled(cron = "0 0 2 * * ?") // Run daily at 2 AM
    public void cleanupExpiredNotifications() {
        List<Notification> expiredNotifications = notificationRepository
                .findByExpiresAtBeforeAndIsReadFalse(LocalDateTime.now());

        log.info("Cleaning up {} expired notifications", expiredNotifications.size());
        notificationRepository.deleteAll(expiredNotifications);
    }

    // Helper method to create notification
    private Notification createNotification(NotificationType type, String title, String message,
                                            UserRoleEnum recipientType, UUID recipientId, String binId,
                                            Priority priority, Map<String, Object> metadata,
                                            LocalDateTime expiresAt) {
        return Notification.builder()
                .notificationType(type)
                .title(title)
                .message(message)
                .recipientType(recipientType)
                .recipientId(recipientId)
                .binId(binId)
                .priority(priority)
                .metadata(metadata)
                .expiresAt(expiresAt)
                .build();
    }

    // Convert entity to DTO
    private NotificationDTO convertToDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .type(notification.getNotificationType().name())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .priority(notification.getPriority().name())
                .recipientType(notification.getRecipientType().name())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .binId(notification.getBinId())
                .maintenanceRequestId(notification.getMaintenanceRequestId())
                .metadata(notification.getMetadata())
                .build();
    }

    // Send real-time notification
    private void sendRealTimeNotification(String userId, NotificationDTO notification) {
        try {
            webSocketHandler.sendNotificationToUser(userId, notification);
        } catch (Exception e) {
            log.error("Failed to send real-time notification to user {}: {}", userId, e.getMessage());
        }
    }
}

