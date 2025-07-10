package com.greenpulse.greenpulse_backend.controller;


import com.greenpulse.greenpulse_backend.dto.AddTruckRequestDTO;
import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.ChangeTruckStatusRequestDTO;
import com.greenpulse.greenpulse_backend.enums.TruckStatusEnum;
import com.greenpulse.greenpulse_backend.enums.UserRoleEnum;
import com.greenpulse.greenpulse_backend.model.TruckAssignment;
import com.greenpulse.greenpulse_backend.model.TruckInventory;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.service.TruckInventoryService;
import com.greenpulse.greenpulse_backend.service.UserTableService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class UserManagementController {

    private final UserTableService userTableService;

    @Autowired
    public UserManagementController(UserTableService userTableService) {
        this.userTableService = userTableService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserTable>>> getAllUsers() {
        ApiResponse<List<UserTable>> response=userTableService.getAllUsers();
        return ResponseEntity.ok(response);
    }

}
