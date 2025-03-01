package com.greenpulse.greenpulse_backend.repository;

import com.greenpulse.greenpulse_backend.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<Users, Integer> {

    boolean existsByUsername(String username);

    Users findByUsername(String username);

}
