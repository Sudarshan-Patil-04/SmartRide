package com.smartride.backend.vehicle.repository;

import com.smartride.backend.vehicle.model.Vehicle;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface VehicleRepository
        extends MongoRepository<Vehicle, String> {

    Optional<Vehicle> findByDriverId(String driverId);
}