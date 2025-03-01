package com.greenpulse.greenpulse_backend.controller;

import com.greenpulse.greenpulse_backend.service.MqttPubSubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mqtt")
public class MqttController {

    @Autowired
    private MqttPubSubService mqttService;

    @GetMapping("/run")
    public String runMqtt() {
        try {
            mqttService.run();
            return "MQTT operations completed successfully!";
        } catch (Exception e) {
            return "Error during MQTT operations: " + e.getMessage();
        }
    }
}