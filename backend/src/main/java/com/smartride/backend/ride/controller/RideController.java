package com.smartride.backend.ride.controller;

import com.smartride.backend.driver.model.Driver;

import com.smartride.backend.ride.dto.CreateRideRequest;
import com.smartride.backend.ride.dto.DriverLocationResponse;
import com.smartride.backend.ride.model.Ride;
import com.smartride.backend.ride.service.RideService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/rides")
public class RideController {

    private final RideService rideService;

    public RideController(
            RideService rideService
    ) {
        this.rideService = rideService;
    }


    // ==========================================
    // CREATE RIDE
    // ==========================================

    @PostMapping
    public Ride createRide(
            @RequestBody CreateRideRequest request,
            Authentication authentication
    ) {

        String customerId =
                authentication.getName();

        return rideService.createRide(
                customerId,
                request
        );
    }


    // ==========================================
    // GET ALL CUSTOMER RIDES
    // ==========================================

    @GetMapping
    public List<Ride> getCustomerRides(
            Authentication authentication
    ) {

        String customerId =
                authentication.getName();

        return rideService.getCustomerRides(
                customerId
        );
    }


    // ==========================================
    // GET SINGLE RIDE
    // ==========================================

    @GetMapping("/{rideId}")
    public Ride getCustomerRide(
            @PathVariable String rideId,
            Authentication authentication
    ) {

        String customerId =
                authentication.getName();

        return rideService.getCustomerRide(
                rideId,
                customerId
        );
    }


    // ==========================================
    // FIND NEARBY DRIVERS
    // ==========================================

    @GetMapping("/{rideId}/nearby-drivers")
    public List<Driver> findNearbyDrivers(
            @PathVariable String rideId
    ) {

        return rideService.findDriversForRide(
                rideId
        );
    }


    // ==========================================
    // CANCEL RIDE
    // ==========================================

    @PutMapping("/{rideId}/cancel")
    public Ride cancelRide(
            @PathVariable String rideId,
            Authentication authentication
    ) {

        String customerId =
                authentication.getName();

        return rideService.cancelRide(
                rideId,
                customerId
        );
    }


    // ==========================================
    // GET DRIVER LOCATION
    // ==========================================

    @GetMapping("/{rideId}/driver-location")
    public DriverLocationResponse getDriverLocation(
            @PathVariable String rideId,
            Authentication authentication
    ) {

        String customerId =
                authentication.getName();

        return rideService.getDriverLocation(
                rideId,
                customerId
        );
    }
}