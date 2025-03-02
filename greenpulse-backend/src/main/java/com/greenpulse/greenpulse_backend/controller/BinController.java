package com.greenpulse.greenpulse_backend.controller;

import com.greenpulse.greenpulse_backend.model.Bin;
import com.greenpulse.greenpulse_backend.service.BinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bins")
public class BinController {

    @Autowired
    private BinService binService;

    @GetMapping
    public ResponseEntity<List<Bin>> getAllBins() {
        return ResponseEntity.ok(binService.getAllBins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bin> getBinById(@PathVariable String id) {
        return binService.getBinById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}