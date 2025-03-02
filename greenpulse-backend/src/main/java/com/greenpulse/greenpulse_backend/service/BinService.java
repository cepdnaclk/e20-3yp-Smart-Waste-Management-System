package com.greenpulse.greenpulse_backend.service;

import com.greenpulse.greenpulse_backend.model.Bin;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BinService {

    // In a real application, this would be connected to your database or IoT service
    private final Map<String, Bin> bins = new HashMap<>();

    public BinService() {
        // Sample data - in a real app, this would come from IoT sensors
        bins.put("1", new Bin("1", "Plastic", 50, "2nd March 2025", "5th March 2025"));
        bins.put("2", new Bin("2", "Paper", 40, "1st March 2025", "4th March 2025"));
        bins.put("3", new Bin("3", "Glass", 60, "28th Feb 2025", "3rd March 2025"));
    }

    public List<Bin> getAllBins() {
        return new ArrayList<>(bins.values());
    }

    public Optional<Bin> getBinById(String id) {
        return Optional.ofNullable(bins.get(id));
    }

    // In a real application, you would add methods to update bin data from IoT devices
    public void updateBinFillLevel(String id, int newFillLevel) {
        if (bins.containsKey(id)) {
            Bin bin = bins.get(id);
            bin.setFillLevel(newFillLevel);
        }
    }
}