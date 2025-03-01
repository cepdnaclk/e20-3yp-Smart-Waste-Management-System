package com.greenpulse.greenpulse_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.crt.mqtt.*;

import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CountDownLatch;

@Service
public class MqttPubSubService {

    @Autowired
    private MqttClientConnection connection;

    @Value("${mqtt.topic}")
    private String topic;

    @Value("${mqtt.message}")
    private String message;

    @Value("${mqtt.count}")
    private int count;

    public void run() throws Exception {
        System.out.println("Starting MQTT operations...");

        // Connect to MQTT
        System.out.println("Connecting to MQTT...");
        CompletableFuture<Boolean> connected = connection.connect();
        boolean sessionPresent = connected.get();
        System.out.println("Connected to " + (!sessionPresent ? "new" : "existing") + " session!");

        // Subscribe to the topic
        System.out.println("Subscribing to topic: " + topic);
        CountDownLatch countDownLatch = new CountDownLatch(count);
        CompletableFuture<Integer> subscribed = connection.subscribe(topic, QualityOfService.AT_LEAST_ONCE, (msg) -> {
            byte[] payloadBytes = msg.getPayload();
            if (payloadBytes == null || payloadBytes.length == 0) {
                System.out.println("Empty or null payload received.");
            } else {
                // Convert payload to a string
                String payload = new String(payloadBytes, StandardCharsets.UTF_8);
                System.out.println("MESSAGE: " + payload);
            }
            countDownLatch.countDown();
        });
        subscribed.get();

        // Publish messages
        System.out.println("Publishing messages...");
        for (int i = 0; i < count; i++) {
            String message = "{\"message\": \"Hello from Spring Boot\"}";
            CompletableFuture<Integer> published = connection.publish(
                    new MqttMessage(topic, message.getBytes(), QualityOfService.AT_LEAST_ONCE, false));
            published.get();
            System.out.println("Published message " + (i + 1) + " to topic: " + topic);
            Thread.sleep(1000);
        }

        // Wait for all messages to be received
        System.out.println("Waiting for messages...");
        countDownLatch.await();

        // Disconnect
        System.out.println("Disconnecting from MQTT...");
        CompletableFuture<Void> disconnected = connection.disconnect();
        disconnected.get();

        System.out.println("MQTT operations completed.");
    }
}
