package com.smartride.backend.ride.repository;

import com.smartride.backend.ride.model.Ride;
import com.smartride.backend.ride.model.RideStatus;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RideRepository
        extends MongoRepository<Ride, String> {

    List<Ride> findByCustomerId(String customerId);

    List<Ride> findByDriverId(String driverId);

    List<Ride> findByStatus(RideStatus status);
}