package com.smartride.backend.ride.controller;

import com.smartride.backend.ride.dto.DriverLocationUpdate;
import com.smartride.backend.ride.model.Ride;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class RideWebSocketController {


    // ==========================================
    // DRIVER LOCATION
    // ==========================================

    @MessageMapping("/driver/location")
    @SendTo("/topic/ride/location")
    public DriverLocationUpdate updateDriverLocation(
            DriverLocationUpdate location
    ) {

        System.out.println(
                "Driver Location Received:"
        );

        System.out.println(
                "Ride ID: "
                + location.getRideId()
        );

        System.out.println(
                "Latitude: "
                + location.getLatitude()
        );

        System.out.println(
                "Longitude: "
                + location.getLongitude()
        );

        return location;
    }


    // ==========================================
    // RIDE STATUS UPDATE
    // ==========================================

    @MessageMapping("/ride/status")
    @SendTo("/topic/ride/status")
    public Ride updateRideStatus(
            Ride ride
    ) {

        System.out.println(
                "Ride Status Update:"
        );

        System.out.println(
                "Ride ID: "
                + ride.getId()
        );

        System.out.println(
                "Status: "
                + ride.getStatus()
        );

        return ride;
    }
}