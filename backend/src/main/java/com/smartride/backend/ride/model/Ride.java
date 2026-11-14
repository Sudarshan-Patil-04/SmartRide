package com.smartride.backend.ride.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "rides")
public class Ride {

    @Id
    private String id;

    private String customerId;

    private String driverId;

    private RideLocation pickup;

    private RideLocation destination;

    private double distance;

    private double estimatedFare;

    private double finalFare;

    private RideStatus status;

    private LocalDateTime requestedAt;

    private LocalDateTime acceptedAt;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    private int estimatedDuration;
}