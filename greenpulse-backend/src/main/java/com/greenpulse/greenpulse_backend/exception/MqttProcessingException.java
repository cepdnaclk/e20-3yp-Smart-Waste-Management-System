package com.greenpulse.greenpulse_backend.exception;

public class MqttProcessingException extends RuntimeException {
    public MqttProcessingException(String message) {
        super(message);
    }
}
