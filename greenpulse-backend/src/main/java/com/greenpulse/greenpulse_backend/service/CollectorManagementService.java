package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.CollectorCreateRequestDTO;
import com.greenpulse.greenpulse_backend.enums.UserRoleEnum;
import com.greenpulse.greenpulse_backend.exception.UserRoleNotFoundException;
import com.greenpulse.greenpulse_backend.exception.UsernameAlreadyExistsException;
import com.greenpulse.greenpulse_backend.model.CollectorProfile;
import com.greenpulse.greenpulse_backend.model.UserRole;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.repository.CollectorProfileRepository;
import com.greenpulse.greenpulse_backend.repository.UserRoleRepository;
import com.greenpulse.greenpulse_backend.repository.UserTableRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CollectorManagementService {

    private final UserTableRepository userRepository;
    private final CollectorProfileRepository collectorProfileRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public CollectorManagementService(
            UserTableRepository userRepository,
            CollectorProfileRepository collectorProfileRepository,
            UserRoleRepository userRoleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.collectorProfileRepository = collectorProfileRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ApiResponse<String> createCollector(CollectorCreateRequestDTO request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        UserRole userRole = userRoleRepository.findByRole(UserRoleEnum.ROLE_COLLECTOR)
                .orElseThrow(() -> new UserRoleNotFoundException("BIN_OWNER role not found"));

        UserTable user = new UserTable();

        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);
        user.setCreatedAt(LocalDateTime.now());

        CollectorProfile profile = new CollectorProfile();
        profile.setUser(user);
        profile.setName(request.getName());

        userRepository.save(user);
        collectorProfileRepository.save(profile);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Collector created successfully")
                .data(null)
                .timestamp(LocalDateTime.now().toString())
                .build();
    }

    @Transactional
    public ApiResponse<String> deleteCollector(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("Collector not found with id " + id);
        }

        collectorProfileRepository.deleteById(id);
        userRepository.deleteById(id);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Collector deleted successfully")
                .data(null)
                .timestamp(LocalDateTime.now().toString())
                .build();
    }
}
