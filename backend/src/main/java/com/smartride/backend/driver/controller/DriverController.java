package com.smartride.backend.driver.controller;

import com.smartride.backend.driver.dto.DriverProfileResponse;
import com.smartride.backend.driver.dto.DriverRegistrationRequest;
import com.smartride.backend.driver.dto.LocationRequest;
import com.smartride.backend.driver.model.Driver;
import com.smartride.backend.driver.service.DriverService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/driver")
@CrossOrigin
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    // =====================================================
    // GET DRIVER PROFILE
    // =====================================================

    @GetMapping("/profile")
    public ResponseEntity<DriverProfileResponse> getDriverProfile(
            Authentication authentication
    ) {

        String userId = authentication.getName();

        DriverProfileResponse response =
                driverService.getDriverProfile(userId);

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // REGISTER / VERIFY DRIVER
    // =====================================================

    @PostMapping("/register")
    public ResponseEntity<Driver> registerDriver(
            Authentication authentication,
            @RequestBody DriverRegistrationRequest request
    ) {

        String userId = authentication.getName();

        Driver driver =
                driverService.registerDriver(
                        userId,
                        request
                );

        return ResponseEntity.ok(driver);
    }

    // =====================================================
    // GO ONLINE
    // =====================================================

    @PutMapping("/online")
    public ResponseEntity<Driver> goOnline(
            Authentication authentication
    ) {

        String userId = authentication.getName();

        Driver driver =
                driverService.goOnline(userId);

        return ResponseEntity.ok(driver);
    }

    // =====================================================
    // GO OFFLINE
    // =====================================================

    @PutMapping("/offline")
    public ResponseEntity<Driver> goOffline(
            Authentication authentication
    ) {

        String userId = authentication.getName();

        Driver driver =
                driverService.goOffline(userId);

        return ResponseEntity.ok(driver);
    }

    // =====================================================
    // UPDATE LOCATION
    // =====================================================

    @PutMapping("/location")
    public ResponseEntity<Driver> updateLocation(
            Authentication authentication,
            @RequestBody LocationRequest request
    ) {

        String userId = authentication.getName();

        Driver driver =
                driverService.updateLocation(
                        userId,
                        request
                );

        return ResponseEntity.ok(driver);
    }

    // =====================================================
    // GET ONLINE DRIVERS
    // =====================================================

    @GetMapping("/online")
    public ResponseEntity<List<Driver>> getOnlineDrivers() {

        return ResponseEntity.ok(
                driverService.getOnlineDrivers()
        );
    }
}