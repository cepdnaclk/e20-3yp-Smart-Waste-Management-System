package com.greenpulse.greenpulse_backend.model;

public class Bin {
    private String id;
    private String type;
    private int fillLevel;
    private String lastCollected;
    private String nextFillEstimate;

    // Constructors, getters, and setters
    public Bin() {}

    public Bin(String id, String type, int fillLevel, String lastCollected, String nextFillEstimate) {
        this.id = id;
        this.type = type;
        this.fillLevel = fillLevel;
        this.lastCollected = lastCollected;
        this.nextFillEstimate = nextFillEstimate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getFillLevel() {
        return fillLevel;
    }

    public void setFillLevel(int fillLevel) {
        this.fillLevel = fillLevel;
    }

    public String getLastCollected() {
        return lastCollected;
    }

    public void setLastCollected(String lastCollected) {
        this.lastCollected = lastCollected;
    }

    public String getNextFillEstimate() {
        return nextFillEstimate;
    }

    public void setNextFillEstimate(String nextFillEstimate) {
        this.nextFillEstimate = nextFillEstimate;
    }
}