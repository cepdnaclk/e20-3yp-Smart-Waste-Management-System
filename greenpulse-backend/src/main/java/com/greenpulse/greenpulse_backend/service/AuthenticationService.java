package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.dto.AuthenticationRequest;
import com.greenpulse.greenpulse_backend.dto.AuthenticationResponse;
import com.greenpulse.greenpulse_backend.dto.RegisterRequest;
import com.greenpulse.greenpulse_backend.enums.UserRoleEnum;
import com.greenpulse.greenpulse_backend.model.BinOwnerProfile;
import com.greenpulse.greenpulse_backend.model.UserRole;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.repository.BinOwnerProfileRepository;
import com.greenpulse.greenpulse_backend.repository.UserRoleRepository;
import com.greenpulse.greenpulse_backend.repository.UserTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthenticationService {

    private final UserTableRepository userTableRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserRoleRepository userRoleRepository;
    private final BinOwnerProfileRepository binOwnerProfileRepository;

    @Autowired
    public AuthenticationService(
            UserTableRepository userTableRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            UserRoleRepository userRoleRepository,
            BinOwnerProfileRepository binOwnerProfileRepository) {
        this.userTableRepository = userTableRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userRoleRepository = userRoleRepository;
        this.binOwnerProfileRepository = binOwnerProfileRepository;
    }

    public AuthenticationResponse register(RegisterRequest request) {
        Optional<UserRole> userRole = userRoleRepository.findByRole(UserRoleEnum.BIN_OWNER);

        UserTable user = new UserTable();

        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole.get());
        user.setCreatedAt(LocalDateTime.now());

        userTableRepository.save(user);

        BinOwnerProfile binOwnerProfile = new BinOwnerProfile();

        binOwnerProfile.setUser(user);
        binOwnerProfile.setName(request.getName());
        binOwnerProfile.setAddress(request.getAddress());
        binOwnerProfile.setMobileNumber(request.getMobileNumber());
        binOwnerProfile.setEmailVerified(false);

        binOwnerProfileRepository.save(binOwnerProfile);

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        var user = userTableRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        var jwtToken = jwtService.generateToken(user);

        return  AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
