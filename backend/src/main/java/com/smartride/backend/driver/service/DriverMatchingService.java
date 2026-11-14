package com.smartride.backend.driver.service;

import com.smartride.backend.driver.model.Driver;
import com.smartride.backend.driver.model.Location;
import com.smartride.backend.driver.repository.DriverRepository;
import com.smartride.backend.ride.model.RideLocation;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DriverMatchingService {

    private final DriverRepository driverRepository;

    public DriverMatchingService(
            DriverRepository driverRepository
    ) {
        this.driverRepository = driverRepository;
    }

    public List<Driver> findNearbyDrivers(
            RideLocation pickup
    ) {

        List<Driver> onlineDrivers =
                driverRepository.findByOnlineTrue();

        List<Driver> nearbyDrivers =
                new ArrayList<>();

        double searchRadius = 10.0;

        for (Driver driver : onlineDrivers) {

            Location location =
                    driver.getCurrentLocation();

            if (location == null) {
                continue;
            }

            double distance =
                    calculateDistance(
                            pickup.getLatitude(),
                            pickup.getLongitude(),
                            location.getLatitude(),
                            location.getLongitude()
                    );

            if (distance <= searchRadius) {

                nearbyDrivers.add(driver);
            }
        }

        return nearbyDrivers;
    }

    private double calculateDistance(
            double lat1,
            double lon1,
            double lat2,
            double lon2
    ) {

        double earthRadius = 6371;

        double latDistance =
                Math.toRadians(lat2 - lat1);

        double lonDistance =
                Math.toRadians(lon2 - lon1);

        double a =
                Math.sin(latDistance / 2)
                        * Math.sin(latDistance / 2)
                +
                Math.cos(Math.toRadians(lat1))
                        * Math.cos(Math.toRadians(lat2))
                        *
                        Math.sin(lonDistance / 2)
                        * Math.sin(lonDistance / 2);

        double c =
                2 * Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a)
                );

        return earthRadius * c;
    }
}