package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.AuthenticationDataDTO;
import com.greenpulse.greenpulse_backend.dto.AuthenticationRequestDTO;
import com.greenpulse.greenpulse_backend.dto.RegisterRequestDTO;
import com.greenpulse.greenpulse_backend.enums.UserRoleEnum;
import com.greenpulse.greenpulse_backend.exception.AuthenticationFailedException;
import com.greenpulse.greenpulse_backend.exception.UserRoleNotFoundException;
import com.greenpulse.greenpulse_backend.exception.UsernameAlreadyExistsException;
import com.greenpulse.greenpulse_backend.model.BinOwnerProfile;
import com.greenpulse.greenpulse_backend.model.UserRole;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.repository.BinOwnerProfileRepository;
import com.greenpulse.greenpulse_backend.repository.UserRoleRepository;
import com.greenpulse.greenpulse_backend.repository.UserTableRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthenticationService {

    private final UserTableRepository userTableRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserRoleRepository userRoleRepository;
    private final BinOwnerProfileRepository binOwnerProfileRepository;
    private final EmailVerificationService emailVerificationService;

    @Autowired
    public AuthenticationService(
            UserTableRepository userTableRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            UserRoleRepository userRoleRepository,
            BinOwnerProfileRepository binOwnerProfileRepository,
            EmailVerificationService emailVerificationService
    ) {
        this.userTableRepository = userTableRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userRoleRepository = userRoleRepository;
        this.binOwnerProfileRepository = binOwnerProfileRepository;
        this.emailVerificationService = emailVerificationService;
    }

    @Transactional
    public ApiResponse<AuthenticationDataDTO> register(RegisterRequestDTO request) {
        if (userTableRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UsernameAlreadyExistsException("Email already exists");
        }

        UserRole userRole = userRoleRepository.findByRole(UserRoleEnum.BIN_OWNER)
                .orElseThrow(() -> new UserRoleNotFoundException("BIN_OWNER role not found"));

        UserTable user = new UserTable();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);
        user.setCreatedAt(LocalDateTime.now());

        userTableRepository.save(user);

        BinOwnerProfile binOwnerProfile = new BinOwnerProfile();
        binOwnerProfile.setUser(user);
        binOwnerProfile.setName(request.getName());
        binOwnerProfile.setAddress(request.getAddress());
        binOwnerProfile.setMobileNumber(request.getMobileNumber());
        binOwnerProfile.setEmailVerified(false);

        binOwnerProfileRepository.save(binOwnerProfile);

        emailVerificationService.generateEmailVerificationCode(user.getId());

        var jwtToken = jwtService.generateToken(user);

        return ApiResponse.<AuthenticationDataDTO>builder()
                .success(true)
                .message("Registration Successful")
                .data(new AuthenticationDataDTO(jwtToken))
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<AuthenticationDataDTO> authenticate(AuthenticationRequestDTO request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (Exception ex) {
            throw new AuthenticationFailedException("Invalid username or password");
        }


        var user = userTableRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        var jwtToken = jwtService.generateToken(user);

        return  ApiResponse.<AuthenticationDataDTO>builder()
                .success(true)
                .message("Login Successful")
                .data(new AuthenticationDataDTO(jwtToken))
                .timestamp(LocalDateTime.now())
                .build();
    }
}
