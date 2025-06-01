package com.greenpulse.greenpulse_backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.greenpulse.greenpulse_backend.dto.BinStatusDTO;
import com.greenpulse.greenpulse_backend.exception.BinNotFoundException;
import com.greenpulse.greenpulse_backend.exception.UserNotFoundException;
import com.greenpulse.greenpulse_backend.model.BinInventory;
import com.greenpulse.greenpulse_backend.model.BinOwnerProfile;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.repository.BinInventoryRepository;
import com.greenpulse.greenpulse_backend.repository.UserTableRepository;
import com.greenpulse.greenpulse_backend.websocket.BinStatusWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BinStatusSocketService {
    private final BinStatusWebSocketHandler handler;
    private final ObjectMapper objectMapper;
    private final BinInventoryRepository binInventory;
    private final UserTableRepository userRepository;

    @Autowired
    public BinStatusSocketService(
            BinStatusWebSocketHandler handler,
            ObjectMapper objectMapper,
            BinInventoryRepository binInventory,
            UserTableRepository userRepository) {
        this.handler = handler;
        this.objectMapper = objectMapper;
        this.binInventory = binInventory;
        this.userRepository = userRepository;
    }

    public void sendBinStatusToUser(String binId, BinStatusDTO dto) {
        BinInventory bin = binInventory.findById(binId)
                .orElseThrow(() -> new BinNotFoundException(binId));
        UserTable user = userRepository.findById(bin.getOwner().getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        try {
            String jsonMessage = objectMapper.writeValueAsString(dto);
            handler.sendStatusToUser(user.getUsername(), jsonMessage);
        } catch (JsonProcessingException e) {
            System.out.println("Error converting DTO to JSON: " + e.getMessage());
        }
    }
}
