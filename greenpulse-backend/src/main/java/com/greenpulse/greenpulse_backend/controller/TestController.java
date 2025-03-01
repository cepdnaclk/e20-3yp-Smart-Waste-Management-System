package com.greenpulse.greenpulse_backend.controller;

import com.greenpulse.greenpulse_backend.service.UserService;
import com.greenpulse.greenpulse_backend.model.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin") // Base path for admin endpoints
public class TestController {

    @Autowired
    private UserService userService; // Shared service for user operations

    @GetMapping("/getAdminDetails/{id}")
    public Optional<Users> getAdminDetails(@PathVariable int id) {
        // Fetch admin details using UserService
        return userService.getUserByUserId(id);
    }
}

