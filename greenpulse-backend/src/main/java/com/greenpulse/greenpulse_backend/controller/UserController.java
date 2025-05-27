//package com.greenpulse.greenpulse_backend.controller;
//
//import com.greenpulse.greenpulse_backend.model.Users;
//import com.greenpulse.greenpulse_backend.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/user") // Base path for user endpoints
//public class UserController {
//
//    @Autowired
//    private UserService userService; // Shared service for user operations
//
//    @GetMapping("/getUserDetails/{id}")
//    public Optional<Users> getUserDetails(@PathVariable int id) {
//        return userService.getUserByUserId(id);
//    }
//}
//
//
