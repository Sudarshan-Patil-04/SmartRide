package com.smartride.backend.ride.model;

import lombok.Data;

@Data
public class RideLocation {

    private double latitude;

    private double longitude;

    private String address;
}