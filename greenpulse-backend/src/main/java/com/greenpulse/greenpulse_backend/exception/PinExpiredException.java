package com.greenpulse.greenpulse_backend.exception;

public class PinExpiredException extends RuntimeException {
    public PinExpiredException(String message) {
        super(message);
    }
}
