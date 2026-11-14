package com.smartride.backend.vehicle.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "vehicles")
public class Vehicle {

    @Id
    private String id;

    private String driverId;

    private String vehicleNumber;

    private String model;

    private String color;

    private VehicleType type;
}