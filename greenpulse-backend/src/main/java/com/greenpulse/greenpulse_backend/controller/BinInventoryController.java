package com.greenpulse.greenpulse_backend.controller;

import com.greenpulse.greenpulse_backend.dto.AddBinRequestDTO;
import com.greenpulse.greenpulse_backend.dto.ApiResponse;
import com.greenpulse.greenpulse_backend.dto.ChangeBinStatusRequestDTO;
import com.greenpulse.greenpulse_backend.dto.ChangeOwnerRequestDTO;
import com.greenpulse.greenpulse_backend.enums.BinStatusEnum;
import com.greenpulse.greenpulse_backend.model.BinInventory;
import com.greenpulse.greenpulse_backend.model.UserTable;
import com.greenpulse.greenpulse_backend.service.BinInventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bins")
public class BinInventoryController {

    private final BinInventoryService binService;

    @Autowired
    public BinInventoryController(BinInventoryService binService) {
        this.binService = binService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ApiResponse<List<BinInventory>> getBins(
            @RequestParam(required = false) BinStatusEnum status,
            @RequestParam(required = false) UUID ownerId
    ) {
        return binService.getBinsFiltered(status, ownerId);
    }

    @GetMapping("/fetch")
    @PreAuthorize("hasRole('BIN_OWNER')")
    public ApiResponse<List<BinInventory>> getBins(@AuthenticationPrincipal UserTable userTable) {
        return binService.getBinsFiltered(BinStatusEnum.ASSIGNED, userTable.getId());
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BinInventory> addBin(@Valid @RequestBody AddBinRequestDTO request) {
        return binService.addBin(request.getBinId());
    }

    @DeleteMapping("/{binId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteBin(@PathVariable String binId) {
        return binService.deleteBin(binId);
    }

    @PutMapping("/{binId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BinInventory> changeStatus(@PathVariable String binId,
                                                  @RequestBody ChangeBinStatusRequestDTO request) {
        return binService.changeStatus(binId, request.getStatus());
    }

    @PutMapping("/{binId}/owner")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BinInventory> changeOwner(@PathVariable String binId,
                                                 @RequestBody ChangeOwnerRequestDTO request) {
        return binService.changeOwner(binId, request.getNewOwnerId());
    }

    @PutMapping("/{binId}/assign")
    @PreAuthorize("hasRole('BIN_OWNER')")
    public ApiResponse<BinInventory> assignBinToSelf(@PathVariable String binId, @AuthenticationPrincipal UserTable user) {
        return binService.assignBinToOwner(binId, user.getId());
    }
}
