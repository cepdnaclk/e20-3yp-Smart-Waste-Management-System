package com.greenpulse.greenpulse_backend.service;


import com.greenpulse.greenpulse_backend.model.Roles;
import com.greenpulse.greenpulse_backend.model.Users;
import com.greenpulse.greenpulse_backend.repository.RolesRepository;
import com.greenpulse.greenpulse_backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class UserService {

    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    private UserRepository repo;

    @Autowired
    private RolesRepository rolesRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public List<Users> getAllUsers(){
        List<Users> usersList=repo.findAll();
        return usersList;
    }

    public Optional<Users> getUserByUserId(int id){
        Optional<Users> user=repo.findById(id);
        return user;
    }

//    public UserDtos register(Users user) {
//        user.setPassword(encoder.encode(user.getPassword()));
//        UserDtos userDtos=UserDtos.fromUser(user);
//        repo.save(user);
//        return userDtos;
//    }

    public Users register(Users user) {
        // Encrypt the user's password
        if (repo.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username is already in use");
        }
        else{
        user.setPassword(encoder.encode(user.getPassword()));
        user.setRoles(user.getRoles());
        user.setUsername(user.getUsername());

        repo.save(user);

        return user;
        }
        // Ensure that the user has a role (you can add a default role or handle this differently)
//        if (user.getRoles() == null) {
//            // Get the default role, e.g., ROLE_USER (assuming role with ID 1 exists)
//            Roles defaultRole = rolesRepo.findById(1L).orElseThrow(() -> new RuntimeException("Role not found"));
//            user.setRoles(defaultRole); // Assign default role
//        }

        // Save the user to the database

    }


    public String verify(Users user) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(user.getUsername());
        } else {
            return "fail";
        }
    }
    public Users getRoleByUsername(String username){
        return repo.findByUsername(username);
    }

    public Roles getRoleByRoleID(Long roleId) {
        return rolesRepository.findById(roleId)
                .orElseThrow(() -> new EntityNotFoundException("Role not found with id " + roleId));
    }

}
