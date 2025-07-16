package com.greenpulse.greenpulse_backend.controller;

import com.greenpulse.greenpulse_backend.dto.*;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.enums.NotificationType;
import com.greenpulse.greenpulse_backend.enums.UserRoleEnum;
import com.greenpulse.greenpulse_backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getNotifications(
            @AuthenticationPrincipal UserTable user) {

        UserRoleEnum userRole = user.getRole(); // Direct usage of your enum
        List<NotificationDTO> notifications = notificationService
                .getNotificationsForUser(user.getId(), userRole);

        return ResponseEntity.ok(ApiResponse.<List<NotificationDTO>>builder()
                .success(true)
                .message("Notifications retrieved successfully")
                .data(notifications)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/filtered")
    public ResponseEntity<ApiResponse<Page<NotificationDTO>>> getFilteredNotifications(
            @AuthenticationPrincipal UserTable user,
            @ModelAttribute NotificationFilterDTO filter) {

        UserRoleEnum userRole = user.getRole(); // Direct usage of your enum
        Page<NotificationDTO> notifications = notificationService
                .getNotificationsWithFilters(user.getId(), userRole, filter);

        return ResponseEntity.ok(ApiResponse.<Page<NotificationDTO>>builder()
                .success(true)
                .message("Filtered notifications retrieved successfully")
                .data(notifications)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal UserTable user) {
        UserRoleEnum userRole = user.getRole(); // Direct usage of your enum
        long unreadCount = notificationService.getUnreadCount(user.getId(), userRole);

        return ResponseEntity.ok(ApiResponse.<Long>builder()
                .success(true)
                .message("Unread count retrieved successfully")
                .data(unreadCount)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<NotificationStatsDTO>> getNotificationStats(
            @AuthenticationPrincipal UserTable user) {

        UserRoleEnum userRole = user.getRole(); // Direct usage of your enum
        NotificationStatsDTO stats = notificationService.getNotificationStats(user.getId(), userRole);

        return ResponseEntity.ok(ApiResponse.<NotificationStatsDTO>builder()
                .success(true)
                .message("Notification statistics retrieved successfully")
                .data(stats)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<Object>> markAsRead(
            @PathVariable UUID notificationId,
            @AuthenticationPrincipal UserTable user) {

        notificationService.markAsRead(notificationId, user.getId());

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Notification marked as read")
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<Object>> markAllAsRead(@AuthenticationPrincipal UserTable user) {
        UserRoleEnum userRole = user.getRole(); // Direct usage of your enum
        notificationService.markAllAsRead(user.getId(), userRole);

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("All notifications marked as read")
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @DeleteMapping("/bulk-delete")
    public ResponseEntity<ApiResponse<Object>> deleteNotifications(
            @RequestBody List<UUID> notificationIds,
            @AuthenticationPrincipal UserTable user) {

        notificationService.deleteNotifications(notificationIds, user.getId());

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Notifications deleted successfully")
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/types")
    public ResponseEntity<ApiResponse<List<String>>> getNotificationTypes() {
        List<String> types = Arrays.stream(NotificationType.values())
                .map(Enum::name)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.<List<String>>builder()
                .success(true)
                .message("Notification types retrieved successfully")
                .data(types)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }
}
