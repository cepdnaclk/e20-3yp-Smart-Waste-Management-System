//package com.greenpulse.greenpulse_backend.controller;
//
//
//import com.greenpulse.greenpulse_backend.model.Users;
//import com.greenpulse.greenpulse_backend.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.Map;
//
//
//@RestController
//@RequestMapping("/api") // Base path for user endpoints
//public class AuthController {
//
//
//    @Autowired
//    private UserService service; // Assuming UserService handles user-related logic
//
//    @PostMapping("/register")
//    public Users register(@RequestBody Users user) {
//        Users users=service.register(user);
//        return users;
//    }
//
//    // Login endpoint
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody Users user) {
////        System.out.println("user :" +user);
////        return ResponseEntity.ok("user");
//        try {
//            String result = service.verify(user);
//            String role =(service.getRoleByUsername(user.getUsername())).getRoles().getRoleName();
//
//            // Return both token and role in JSON format
//            Map<String, String> response = new HashMap<>();
//            response.put("token", result);
//            response.put("role", role);
//            System.out.println(response);
//            // Ensure this field exists in your Users model
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: " + e.getMessage());
//        }
//    }
//}
//
