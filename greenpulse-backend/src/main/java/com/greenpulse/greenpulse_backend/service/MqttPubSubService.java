package com.greenpulse.greenpulse_backend.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.crt.mqtt.*;

import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;

@Service
public class MqttPubSubService {

    private final MqttClientConnection connection;

    @Autowired
    public MqttPubSubService(MqttClientConnection connection) {
        this.connection = connection;
    }

    @Value("${mqtt.topic}")
    private String topic;

    @PostConstruct
    public void startListening() {
        System.out.println("Starting MQTT listener...");

        // Connect to MQTT
        try {
            System.out.println("Connecting to MQTT...");
            CompletableFuture<Boolean> connected = connection.connect();
            boolean sessionPresent = connected.get();
            System.out.println("Connected to " + (!sessionPresent ? "new" : "existing") + " session!");

            // Subscribe to the topic
            System.out.println("Subscribing to topic: " + topic);
            connection.subscribe(topic, QualityOfService.AT_LEAST_ONCE, (msg) -> {
                String payload = new String(msg.getPayload(), StandardCharsets.UTF_8);
                System.out.println("MESSAGE: " + payload);
            }).get();

            System.out.println("Listening for messages on topic: " + topic);
        } catch (Exception e) {
            System.err.println("Error during MQTT connection or subscription: " + e.getMessage());
        }
    }
}
