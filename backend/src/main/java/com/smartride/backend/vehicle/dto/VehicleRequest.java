package com.smartride.backend.vehicle.dto;

import com.smartride.backend.vehicle.model.VehicleType;
import lombok.Data;

@Data
public class VehicleRequest {

    private String vehicleNumber;

    private String model;

    private String color;

    private VehicleType type;
}