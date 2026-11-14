package com.smartride.backend.customer.controller;

import com.smartride.backend.ride.service.RideService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final RideService rideService;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public CustomerController(
            RideService rideService
    ) {

        this.rideService =
                rideService;

    }


    // ==========================================
    // PROFILE
    // ==========================================

    @GetMapping("/profile")
    public String profile(
            Authentication authentication
    ) {

        return "Customer ID: "
                + authentication.getName();

    }


    // ==========================================
    // DELETE RIDE FROM HISTORY
    // ==========================================

    @DeleteMapping("/rides/{rideId}")
    public String deleteRide(
            @PathVariable String rideId,
            Authentication authentication
    ) {

        rideService.deleteCustomerRide(
                rideId,
                authentication.getName()
        );

        return "Ride deleted successfully";

    }

}