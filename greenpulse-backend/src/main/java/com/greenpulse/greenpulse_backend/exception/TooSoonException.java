package com.greenpulse.greenpulse_backend.exception;

public class TooSoonException extends RuntimeException {
    public TooSoonException(String message) {
        super(message);
    }
}
