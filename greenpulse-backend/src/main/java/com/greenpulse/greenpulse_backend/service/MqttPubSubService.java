package com.greenpulse.greenpulse_backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.greenpulse.greenpulse_backend.dto.BinStatusDTO;
import com.greenpulse.greenpulse_backend.exception.BinIdExtractionException;
import com.greenpulse.greenpulse_backend.exception.BinStatusNotFoundException;
import com.greenpulse.greenpulse_backend.exception.MqttProcessingException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.crt.mqtt.*;

import java.nio.charset.StandardCharsets;

@Service
@Slf4j
public class MqttPubSubService {

    private final MqttClientConnection connection;
    private final ObjectMapper objectMapper;
    private final BinStatusService binStatusService;
    private final BinStatusSocketService binStatusSocketService;

    @Value("${mqtt.topic.status}")
    private String statusTopic;

    @Value("${mqtt.topic.location}")
    private String locationTopic;

    @Autowired
    public MqttPubSubService(
            MqttClientConnection connection,
            ObjectMapper objectMapper,
            BinStatusService binStatusService,
            BinStatusSocketService binStatusSocketService
    ) {
        this.connection = connection;
        this.objectMapper = objectMapper;
        this.binStatusService = binStatusService;
        this.binStatusSocketService = binStatusSocketService;
    }

    @PostConstruct
    public void startListening() {
        try {
            connection.connect().get();
            subscribeToStatusTopic();
            subscribeToLocationTopic();
        } catch (Exception e) {
            log.error("MQTT connection or subscription error", e);
            throw new MqttProcessingException("Failed to connect or subscribe to MQTT topics");
        }
    }

    private void subscribeToStatusTopic() throws Exception {
        connection.subscribe(statusTopic, QualityOfService.AT_LEAST_ONCE, this::handleStatusMessage).get();
        log.info("Subscribed to STATUS topic: {}", statusTopic);
    }

    private void subscribeToLocationTopic() throws Exception {
        connection.subscribe(locationTopic, QualityOfService.AT_LEAST_ONCE, this::handleLocationMessage).get();
        log.info("Subscribed to LOCATION topic: {}", locationTopic);
    }

    private void handleStatusMessage(MqttMessage message) {
        String payload = new String(message.getPayload(), StandardCharsets.UTF_8);
        String topic = message.getTopic();

        try {
            String binId = extractBinIdFromTopic(topic);
            BinStatusDTO statusDto = objectMapper.readValue(payload, BinStatusDTO.class);
            statusDto.setBinId(binId);

            binStatusService.updateBinLevels(statusDto);

            statusDto.setBinId(binId);

            binStatusSocketService.sendBinStatusToUser(binId, statusDto);

            log.info("Successfully processed bin status for bin ID: {}", binId);

        } catch (IllegalArgumentException e) {
            log.warn("Invalid topic format '{}'. Skipping message. Error: {}", topic, e.getMessage());
        } catch (JsonProcessingException e) {
            log.warn("Invalid JSON payload for topic '{}': {}. Payload: {}", topic, e.getMessage(), payload);
        } catch (BinStatusNotFoundException e) {
            log.warn("BinStatus not found for topic '{}': {}", topic, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error processing STATUS message from topic '{}': {}", topic, e.getMessage(), e);
        }
    }

    private void handleLocationMessage(MqttMessage message) {
        String payload = new String(message.getPayload(), StandardCharsets.UTF_8);
        String topic = message.getTopic();
        try {
            String binId = extractBinIdFromTopic(topic);
            // TODO: Convert payload and save location data
            log.info("Received location for bin {}: {}", binId, payload);
        } catch (Exception e) {
            log.error("Error processing LOCATION message", e);
            throw new MqttProcessingException("Failed to process LOCATION message");
        }
    }

    private String extractBinIdFromTopic(String topic) {
        // MQTT topic format: greenpulse/bin/{binId}/status
        String[] parts = topic.split("/");
        if (parts.length >= 3) {
            return parts[2];
        } else {
            throw new BinIdExtractionException("Could not extract id from topic: " + topic);
        }
    }
}
