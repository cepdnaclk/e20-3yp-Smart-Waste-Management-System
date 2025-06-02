package com.greenpulse.greenpulse_backend.repository;

import com.greenpulse.greenpulse_backend.enums.TruckStatusEnum;
import com.greenpulse.greenpulse_backend.model.TruckAssignment;
import com.greenpulse.greenpulse_backend.model.TruckInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TruckAssignmentRepository extends JpaRepository<TruckAssignment, Long> {

}
