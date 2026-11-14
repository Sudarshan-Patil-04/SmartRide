package com.smartride.backend.ride.dto;

import com.smartride.backend.ride.model.RideLocation;
import lombok.Data;

@Data
public class CreateRideRequest {

    private RideLocation pickup;

    private RideLocation destination;
}