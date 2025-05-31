package com.greenpulse.greenpulse_backend.repository;

import com.greenpulse.greenpulse_backend.model.UserTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserTableRepository extends JpaRepository<UserTable, UUID> {
    Optional<UserTable> findByUsername(String username);
}
