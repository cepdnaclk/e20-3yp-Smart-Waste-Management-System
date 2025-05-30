package com.greenpulse.greenpulse_backend.exception;

public class TruckNotFoundException extends RuntimeException {
    public TruckNotFoundException(Long truckId) {
        super("Truck with ID " + truckId.toString() + " not found.");
    }
}
