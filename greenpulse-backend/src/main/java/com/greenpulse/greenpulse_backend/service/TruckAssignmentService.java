package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.enums.TruckStatusEnum;
import com.greenpulse.greenpulse_backend.exception.TruckNotFoundException;
import com.greenpulse.greenpulse_backend.exception.UserNotFoundException;
import com.greenpulse.greenpulse_backend.model.CollectorProfile;
import com.greenpulse.greenpulse_backend.model.TruckAssignment;
import com.greenpulse.greenpulse_backend.model.TruckInventory;
import com.greenpulse.greenpulse_backend.repository.CollectorProfileRepository;
import com.greenpulse.greenpulse_backend.repository.TruckAssignmentRepository;
import com.greenpulse.greenpulse_backend.repository.TruckInventoryRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TruckAssignmentService {

    private final TruckInventoryRepository truckInventoryRepository;
    private final CollectorProfileRepository collectorProfileRepository;
    private final TruckAssignmentRepository truckAssignmentRepository;

    @Autowired
    public TruckAssignmentService(
            TruckInventoryRepository truckInventoryRepository,
            CollectorProfileRepository collectorProfileRepository,
            TruckAssignmentRepository truckAssignmentRepository
    ) {
        this.truckInventoryRepository = truckInventoryRepository;
        this.collectorProfileRepository = collectorProfileRepository;
        this.truckAssignmentRepository = truckAssignmentRepository;
    }

    public ApiResponse<List<TruckAssignment>> getAllTrucksWithCollectors(){
        List<TruckAssignment> truckAssignment = truckAssignmentRepository.findAll();
        return ApiResponse.<List<TruckAssignment>>builder()
                .success(true)
                .message("Trucks successfully retrieved")
                .data(truckAssignment)
                .timestamp(LocalDateTime.now().toString())
                .build();
    }

    @Transactional
    public ApiResponse<TruckAssignment> assignTruckToCollector(String registrationNumber, UUID collectorId) {
        TruckInventory truck = truckInventoryRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new TruckNotFoundException("Truck with registration number " + registrationNumber + " not found"));

        if (truck.getStatus() != TruckStatusEnum.AVAILABLE) {
            throw new ValidationException("Truck is not available for assignment");
        }

        CollectorProfile collector = collectorProfileRepository.findById(collectorId)
                .orElseThrow(() -> new UserNotFoundException("Collector profile not found for user ID: " + collectorId));

        truck.setStatus(TruckStatusEnum.IN_SERVICE);
        truckInventoryRepository.save(truck);

        TruckAssignment assignment = new TruckAssignment();
        assignment.setTruck(truck);
        assignment.setCollector(collector);
        assignment.setAssignedDate(LocalDateTime.now());

        truckAssignmentRepository.save(assignment);

        return ApiResponse.<TruckAssignment>builder()
                .success(true)
                .message("Truck successfully assigned to collector")
                .data(null)
                .timestamp(LocalDateTime.now().toString())
                .build();
    }

    public ApiResponse<String> handOverTruck(UUID collectorId,long truckId){
        Optional<TruckInventory> optionalTruck = truckInventoryRepository.findById(truckId);
        if(optionalTruck.isEmpty()){
            return new ApiResponse<>(false,"Truck not found",null,LocalDateTime.now().toString());
        }
        TruckInventory truck = optionalTruck.get();
        if(truck.getStatus() != TruckStatusEnum.IN_SERVICE){
            return new ApiResponse<>(false,"Truck is not in service",null,LocalDateTime.now().toString());
        }
        truck.setStatus(TruckStatusEnum.AVAILABLE);
        truckInventoryRepository.save(truck);
        return new ApiResponse<>(true,"Truck successfully handed over",null,LocalDateTime.now().toString());
    }
}
