package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.enums.UserRoleEnum;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.repository.UserTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class UserTableService {

    private UserTableRepository userTableRepository;

    @Autowired
    public UserTableService(UserTableRepository userTableRepository) {
        this.userTableRepository = userTableRepository;
    }

    public ApiResponse<List<UserTable>> getAllUsersByRole(String Role) {
           List<UserTable> user=userTableRepository.findAllUsersByRole(UserRoleEnum.valueOf(Role));
            return ApiResponse.<List<UserTable>>builder()
                .success(true)
                .message("Bin users fetched successfully")
                .data(user)
                    .timestamp(LocalDateTime.now().toString())
                .build();
    }
}
