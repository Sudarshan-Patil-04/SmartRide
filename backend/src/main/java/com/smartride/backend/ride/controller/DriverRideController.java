package com.smartride.backend.ride.controller;

import com.smartride.backend.ride.model.Ride;
import com.smartride.backend.ride.service.RideService;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/driver/rides")
public class DriverRideController {

    private final RideService rideService;

    private final SimpMessagingTemplate messagingTemplate;


    public DriverRideController(
            RideService rideService,
            SimpMessagingTemplate messagingTemplate
    ) {

        this.rideService =
                rideService;

        this.messagingTemplate =
                messagingTemplate;
    }


    // ==========================================
    // SEND RIDE STATUS
    // ==========================================

    private void sendRideStatus(
            Ride ride
    ) {

        messagingTemplate.convertAndSend(
                "/topic/ride/status",
                ride
        );

    }


    // ==========================================
    // AVAILABLE RIDES
    // ==========================================

    @GetMapping("/available")
    public List<Ride> getAvailableRides(
            Authentication authentication
    ) {

        String driverUserId =
                authentication.getName();

        return rideService.getAvailableRides(
                driverUserId
        );

    }


    // ==========================================
    // ACCEPT RIDE
    // ==========================================

    @PutMapping("/{rideId}/accept")
    public Ride acceptRide(

            @PathVariable
            String rideId,

            Authentication authentication

    ) {

        String driverUserId =
                authentication.getName();


        Ride ride =
                rideService.acceptRide(
                        rideId,
                        driverUserId
                );


        sendRideStatus(
                ride
        );


        return ride;

    }


    // ==========================================
    // DRIVER ARRIVING
    // ==========================================

    @PutMapping("/{rideId}/arriving")
    public Ride driverArriving(

            @PathVariable
            String rideId,

            Authentication authentication

    ) {

        String driverUserId =
                authentication.getName();


        Ride ride =
                rideService.driverArriving(
                        rideId,
                        driverUserId
                );


        sendRideStatus(
                ride
        );


        return ride;

    }


    // ==========================================
    // START RIDE
    // ==========================================

    @PutMapping("/{rideId}/start")
    public Ride startRide(

            @PathVariable
            String rideId,

            Authentication authentication

    ) {

        String driverUserId =
                authentication.getName();


        Ride ride =
                rideService.startRide(
                        rideId,
                        driverUserId
                );


        sendRideStatus(
                ride
        );


        return ride;

    }


    // ==========================================
    // COMPLETE RIDE
    // ==========================================

    @PutMapping("/{rideId}/complete")
    public Ride completeRide(

            @PathVariable
            String rideId,

            Authentication authentication

    ) {

        String driverUserId =
                authentication.getName();


        Ride ride =
                rideService.completeRide(
                        rideId,
                        driverUserId
                );


        sendRideStatus(
                ride
        );


        return ride;

    }


    // ==========================================
    // CURRENT RIDE
    // ==========================================

    @GetMapping("/current")
    public Ride getCurrentRide(
            Authentication authentication
    ) {

        String driverUserId =
                authentication.getName();

        return rideService.getCurrentRide(
                driverUserId
        );

    }


    // ==========================================
    // HISTORY
    // ==========================================

    @GetMapping("/history")
    public List<Ride> getRideHistory(
            Authentication authentication
    ) {

        String driverUserId =
                authentication.getName();

        return rideService.getDriverRideHistory(
                driverUserId
        );

    }

}