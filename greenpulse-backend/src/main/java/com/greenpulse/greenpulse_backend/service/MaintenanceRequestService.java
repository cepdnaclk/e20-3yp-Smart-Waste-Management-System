package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.dto.CreateMaintenanceRequestDTO;
import com.greenpulse.greenpulse_backend.dto.MaintenanceRequestDTO;
import com.greenpulse.greenpulse_backend.model.MaintenanceRequest;
import com.greenpulse.greenpulse_backend.model.MaintenanceRequests;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.enums.MaintenanceStatus;
import com.greenpulse.greenpulse_backend.enums.Priority;
import com.greenpulse.greenpulse_backend.repository.MaintenanceRequestRepository;
import com.greenpulse.greenpulse_backend.repository.UserTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MaintenanceRequestService {

    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final UserTableRepository userTableRepository;
    private final NotificationService notificationService;

    public UUID createRequest(CreateMaintenanceRequestDTO requestDTO, UUID requesterId) {
        MaintenanceRequests request = MaintenanceRequests.builder()
                .binId(requestDTO.getBinId())
                .requesterId(requesterId)
                .requestType(requestDTO.getRequestType())
                .description(requestDTO.getDescription())
                .priority(Priority.valueOf(requestDTO.getPriority()))
                .status(MaintenanceStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        MaintenanceRequests saved = maintenanceRequestRepository.save(request);

        // Create notification for admins
        notificationService.createMaintenanceRequestNotification(
                saved.getId(),
                saved.getBinId(),
                saved.getDescription(),
                requesterId
        );

        return saved.getId();
    }

    public void updateRequestStatus(UUID requestId, MaintenanceStatus status, UUID assignedTo, String notes) {
        MaintenanceRequests request = maintenanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));

        MaintenanceStatus oldStatus = request.getStatus();
        request.setStatus(status);
        request.setAssignedTo(assignedTo);

        if (status == MaintenanceStatus.COMPLETED) {
            request.setResolvedAt(LocalDateTime.now());

            // Create completion notification for requester
            notificationService.createMaintenanceCompletedNotification(
                    requestId,
                    request.getBinId(),
                    request.getRequesterId(),
                    notes != null ? notes : "Maintenance completed successfully"
            );
        }

        maintenanceRequestRepository.save(request);
        log.info("Maintenance request {} status updated from {} to {}", requestId, oldStatus, status);
    }

    public Page<MaintenanceRequestDTO> getRequestsWithFilters(MaintenanceStatus status, String binId,
                                                              UUID requesterId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MaintenanceRequests> requests = maintenanceRequestRepository.findWithFilters(
                status, binId, requesterId, pageable);

        return requests.map(this::convertToDTO);
    }

    public List<MaintenanceRequestDTO> getRequestsByBin(String binId) {
        List<MaintenanceRequests> requests = maintenanceRequestRepository.findByBinIdOrderByCreatedAtDesc(binId);
        return requests.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<MaintenanceRequestDTO> getRequestsByRequester(UUID requesterId) {
        List<MaintenanceRequests> requests = maintenanceRequestRepository.findByRequesterIdOrderByCreatedAtDesc(requesterId);
        return requests.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<MaintenanceRequestDTO> getRequestsByStatus(MaintenanceStatus status) {
        List<MaintenanceRequests> requests = maintenanceRequestRepository.findByStatusOrderByCreatedAtDesc(status);
        return requests.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public MaintenanceRequestDTO getRequestById(UUID requestId) {
        MaintenanceRequests request = maintenanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));
        return convertToDTO(request);
    }

    private MaintenanceRequestDTO convertToDTO(MaintenanceRequests request) {
        UserTable requester = userTableRepository.findById(request.getRequesterId()).orElse(null);
        UserTable assignedUser = request.getAssignedTo() != null ?
                userTableRepository.findById(request.getAssignedTo()).orElse(null) : null;

        return MaintenanceRequestDTO.builder()
                .id(request.getId())
                .binId(request.getBinId())
                .requesterId(request.getRequesterId())
                .requesterName(requester != null ? requester.getUsername() : "Unknown")
                .requestType(request.getRequestType())
                .description(request.getDescription())
                .priority(request.getPriority().name())
                .status(request.getStatus().name())
                .createdAt(request.getCreatedAt())
                .resolvedAt(request.getResolvedAt())
                .assignedTo(request.getAssignedTo())
                .assignedToName(assignedUser != null ? assignedUser.getUsername() : null)
                .build();
    }
}