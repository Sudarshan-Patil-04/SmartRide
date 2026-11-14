package com.smartride.backend.vehicle.service;
import com.smartride.backend.vehicle.dto.VehicleRequest;
import com.smartride.backend.vehicle.model.Vehicle;
import com.smartride.backend.vehicle.repository.VehicleRepository;

import org.springframework.stereotype.Service;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public Vehicle addVehicle(
            String driverId,
            VehicleRequest request
    ) {

        if (vehicleRepository.findByDriverId(driverId).isPresent()) {
            throw new RuntimeException(
                    "Vehicle already registered"
            );
        }

        Vehicle vehicle = new Vehicle();

        vehicle.setDriverId(driverId);
        vehicle.setVehicleNumber(
                request.getVehicleNumber()
        );
        vehicle.setModel(request.getModel());
        vehicle.setColor(request.getColor());
        vehicle.setType(request.getType());

        return vehicleRepository.save(vehicle);
    }
}