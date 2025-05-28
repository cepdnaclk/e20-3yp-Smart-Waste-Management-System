package com.greenpulse.greenpulse_backend.exception;

public class BinAlreadyExistsException extends RuntimeException {
    public BinAlreadyExistsException(String binId) {
        super("Bin with ID " + binId + " already exists.");
    }
}
