package com.greenpulse.greenpulse_backend.repository;

import com.greenpulse.greenpulse_backend.enums.UserRoleEnum;
import com.greenpulse.greenpulse_backend.model.UserTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserTableRepository extends JpaRepository<UserTable, UUID> {
    Optional<UserTable> findByUsername(String username);
    // In your UserTableRepository
//    List<UserTable> findByRole(UserRoleEnum role);

    List<UserTable> findByRole_Role(UserRoleEnum roleEnum);
}
