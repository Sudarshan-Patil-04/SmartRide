package com.smartride.backend.vehicle.controller;

import com.smartride.backend.driver.model.Driver;
import com.smartride.backend.driver.repository.DriverRepository;
import com.smartride.backend.vehicle.dto.VehicleRequest;
import com.smartride.backend.vehicle.model.Vehicle;
import com.smartride.backend.vehicle.service.VehicleService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/driver/vehicle")
public class VehicleController {

    private final VehicleService vehicleService;
    private final DriverRepository driverRepository;

    public VehicleController(
            VehicleService vehicleService,
            DriverRepository driverRepository
    ) {
        this.vehicleService = vehicleService;
        this.driverRepository = driverRepository;
    }

    @PostMapping
    public Vehicle addVehicle(
            @RequestBody VehicleRequest request,
            Authentication authentication
    ) {

        String userId = authentication.getName();

        Driver driver = driverRepository
                .findByUserId(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Driver profile not found"
                        )
                );

        return vehicleService.addVehicle(
                driver.getId(),
                request
        );
    }
}