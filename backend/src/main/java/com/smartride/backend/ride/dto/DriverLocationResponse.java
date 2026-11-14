package com.smartride.backend.ride.dto;

import com.smartride.backend.driver.model.Location;

import lombok.Data;

@Data
public class DriverLocationResponse {

    private String driverId;

    private String driverName;

    private Location location;

    private double rating;
}