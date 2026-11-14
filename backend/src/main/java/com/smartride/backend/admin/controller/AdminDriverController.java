package com.smartride.backend.admin.controller;

import com.smartride.backend.admin.dto.AdminDriverResponse;
import com.smartride.backend.admin.service.AdminDriverService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/drivers")
public class AdminDriverController {

    private final AdminDriverService adminDriverService;

    public AdminDriverController(
            AdminDriverService adminDriverService
    ) {
        this.adminDriverService = adminDriverService;
    }


    // ==========================================
    // GET ALL DRIVERS
    // ==========================================

    @GetMapping
    public List<AdminDriverResponse> getAllDrivers() {

        return adminDriverService.getAllDrivers();
    }


    // ==========================================
    // GET PENDING DRIVERS
    // ==========================================

    @GetMapping("/pending")
    public List<AdminDriverResponse> getPendingDrivers() {

        return adminDriverService.getPendingDrivers();
    }


    // ==========================================
    // GET DRIVER BY ID
    // ==========================================

    @GetMapping("/{driverId}")
    public AdminDriverResponse getDriverById(
            @PathVariable String driverId
    ) {

        return adminDriverService.getDriverById(driverId);
    }


    // ==========================================
    // VERIFY DRIVER
    // ==========================================

    @PutMapping("/{driverId}/verify")
    public AdminDriverResponse verifyDriver(
            @PathVariable String driverId
    ) {

        return adminDriverService.verifyDriver(driverId);
    }


    // ==========================================
    // REJECT DRIVER
    // ==========================================

    @PutMapping("/{driverId}/reject")
    public AdminDriverResponse rejectDriver(
            @PathVariable String driverId
    ) {

        return adminDriverService.rejectDriver(driverId);
    }


    // ==========================================
    // DELETE DRIVER
    // ==========================================

    @DeleteMapping("/{driverId}")
    public void deleteDriver(
            @PathVariable String driverId
    ) {

        adminDriverService.deleteDriver(driverId);
    }
}