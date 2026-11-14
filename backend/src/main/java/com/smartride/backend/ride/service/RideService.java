
package com.smartride.backend.ride.service;

import com.smartride.backend.driver.model.Driver;
import com.smartride.backend.driver.repository.DriverRepository;
import com.smartride.backend.driver.service.DriverMatchingService;

import com.smartride.backend.ride.dto.CreateRideRequest;
import com.smartride.backend.ride.dto.DriverLocationResponse;
import com.smartride.backend.ride.dto.RouteResponse;

import com.smartride.backend.ride.model.Ride;
import com.smartride.backend.ride.model.RideStatus;
import com.smartride.backend.ride.repository.RideRepository;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RideService {

    private final RideRepository rideRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final DriverMatchingService driverMatchingService;
    private final DriverRepository driverRepository;
    private final RoutingService routingService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public RideService(
            RideRepository rideRepository,
            DriverMatchingService driverMatchingService,
            DriverRepository driverRepository,
            RoutingService routingService,
            SimpMessagingTemplate messagingTemplate
    ) {

        this.rideRepository = rideRepository;
        this.driverMatchingService = driverMatchingService;
        this.driverRepository = driverRepository;
        this.routingService = routingService;
        this.messagingTemplate = messagingTemplate;
    }


    // =====================================================
    // BROADCAST RIDE UPDATE
    // =====================================================

    private void broadcastRideUpdate(Ride ride) {

        messagingTemplate.convertAndSend(
                "/topic/ride/status",
                ride
        );
    }


    // =====================================================
    // CREATE RIDE
    // =====================================================

    public Ride createRide(
            String customerId,
            CreateRideRequest request
    ) {

        RouteResponse route =
                routingService.calculateRoute(
                        request.getPickup(),
                        request.getDestination()
                );

        double distance =
                route.getDistanceKm();

        int duration =
                route.getDurationMinutes();

        double fare =
                calculateFare(
                        distance,
                        duration
                );

        Ride ride = new Ride();

        ride.setCustomerId(customerId);

        ride.setPickup(
                request.getPickup()
        );

        ride.setDestination(
                request.getDestination()
        );

        ride.setDistance(
                distance
        );

        ride.setEstimatedDuration(
                duration
        );

        ride.setEstimatedFare(
                fare
        );

        ride.setFinalFare(
                0
        );

        ride.setStatus(
                RideStatus.REQUESTED
        );

        ride.setRequestedAt(
                LocalDateTime.now()
        );

        Ride savedRide =
                rideRepository.save(ride);

        broadcastRideUpdate(savedRide);

        return savedRide;
    }


    // =====================================================
    // CALCULATE FARE
    // =====================================================

    private double calculateFare(
            double distance,
            int duration
    ) {

        double baseFare = 40;
        double perKm = 12;
        double perMinute = 1.5;

        return baseFare
                + (distance * perKm)
                + (duration * perMinute);
    }


    // =====================================================
    // GET CUSTOMER RIDES
    // =====================================================

    public List<Ride> getCustomerRides(
            String customerId
    ) {

        return rideRepository.findByCustomerId(
                customerId
        );
    }


    // =====================================================
    // GET SINGLE CUSTOMER RIDE
    // =====================================================

    public Ride getCustomerRide(
            String rideId,
            String customerId
    ) {

        Ride ride =
                rideRepository
                        .findById(rideId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Ride not found"
                                )
                        );

        if (
                ride.getCustomerId() == null
                        ||
                !ride.getCustomerId().equals(customerId)
        ) {

            throw new RuntimeException(
                    "You are not allowed to access this ride"
            );
        }

        return ride;
    }


    // =====================================================
    // FIND NEARBY DRIVERS
    // =====================================================

    public List<Driver> findDriversForRide(
            String rideId
    ) {

        Ride ride =
                rideRepository
                        .findById(rideId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Ride not found"
                                )
                        );

        if (
                ride.getStatus()
                        != RideStatus.REQUESTED
        ) {

            throw new RuntimeException(
                    "Ride is not available for matching"
            );
        }

        return driverMatchingService.findNearbyDrivers(
                ride.getPickup()
        );
    }


    // =====================================================
    // GET AVAILABLE RIDES FOR DRIVER
    // =====================================================

    public List<Ride> getAvailableRides(
            String driverUserId
    ) {

        Driver driver =
                driverRepository
                        .findByUserId(driverUserId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Driver profile not found"
                                )
                        );

        if (!driver.isOnline()) {

            throw new RuntimeException(
                    "Driver is offline"
            );
        }

        return rideRepository.findByStatus(
                RideStatus.REQUESTED
        );
    }


    // =====================================================
    // ACCEPT RIDE
    // =====================================================

    public Ride acceptRide(
            String rideId,
            String driverUserId
    ) {

        Ride ride =
                rideRepository
                        .findById(rideId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Ride not found"
                                )
                        );

        if (
                ride.getStatus()
                        != RideStatus.REQUESTED
        ) {

            throw new RuntimeException(
                    "Ride is no longer available"
            );
        }

        Driver driver =
                driverRepository
                        .findByUserId(driverUserId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Driver profile not found"
                                )
                        );

        if (!driver.isOnline()) {

            throw new RuntimeException(
                    "Driver is offline"
            );
        }

        // Assign DRIVER profile ID to ride
        ride.setDriverId(
                driver.getId()
        );

        // Change status
        ride.setStatus(
                RideStatus.ACCEPTED
        );

        ride.setAcceptedAt(
                LocalDateTime.now()
        );

        Ride savedRide =
                rideRepository.save(ride);

        // Notify customer
        broadcastRideUpdate(savedRide);

        return savedRide;
    }


    // =====================================================
    // GET CURRENT DRIVER RIDE
    // =====================================================

    public Ride getCurrentRide(
            String driverUserId
    ) {

        Driver driver =
                driverRepository
                        .findByUserId(driverUserId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Driver profile not found"
                                )
                        );

        List<Ride> rides =
                rideRepository.findByDriverId(
                        driver.getId()
                );

        for (Ride ride : rides) {

            if (
                    ride.getStatus()
                            == RideStatus.ACCEPTED

                            ||

                    ride.getStatus()
                            == RideStatus.DRIVER_ARRIVING

                            ||

                    ride.getStatus()
                            == RideStatus.STARTED
            ) {

                return ride;
            }
        }

        throw new RuntimeException(
                "No active ride found"
        );
    }


    // =====================================================
    // DRIVER RIDE HISTORY
    // =====================================================

    public List<Ride> getDriverRideHistory(
            String driverUserId
    ) {

        Driver driver =
                driverRepository
                        .findByUserId(driverUserId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Driver profile not found"
                                )
                        );

        List<Ride> rides =
                rideRepository.findByDriverId(
                        driver.getId()
                );

        return rides.stream()
                .filter(
                        ride ->
                                ride.getStatus()
                                        == RideStatus.COMPLETED

                                        ||

                                ride.getStatus()
                                        == RideStatus.CANCELLED
                )
                .toList();
    }


    // =====================================================
    // DRIVER ARRIVING
    // =====================================================

    public Ride driverArriving(
            String rideId,
            String driverUserId
    ) {

        Ride ride =
                getDriverRide(
                        rideId,
                        driverUserId
                );

        if (
                ride.getStatus()
                        != RideStatus.ACCEPTED
        ) {

            throw new RuntimeException(
                    "Ride cannot be marked as arriving"
            );
        }

        ride.setStatus(
                RideStatus.DRIVER_ARRIVING
        );

        Ride savedRide =
                rideRepository.save(ride);

        broadcastRideUpdate(savedRide);

        return savedRide;
    }


    // =====================================================
    // START RIDE
    // =====================================================

    public Ride startRide(
            String rideId,
            String driverUserId
    ) {

        Ride ride =
                getDriverRide(
                        rideId,
                        driverUserId
                );

        if (
                ride.getStatus()
                        != RideStatus.DRIVER_ARRIVING
        ) {

            throw new RuntimeException(
                    "Ride cannot be started"
            );
        }

        ride.setStatus(
                RideStatus.STARTED
        );

        Ride savedRide =
                rideRepository.save(ride);

        broadcastRideUpdate(savedRide);

        return savedRide;
    }


    // =====================================================
    // COMPLETE RIDE
    // =====================================================

    public Ride completeRide(
            String rideId,
            String driverUserId
    ) {

        Ride ride =
                getDriverRide(
                        rideId,
                        driverUserId
                );

        if (
                ride.getStatus()
                        != RideStatus.STARTED
        ) {

            throw new RuntimeException(
                    "Ride cannot be completed"
            );
        }

        ride.setStatus(
                RideStatus.COMPLETED
        );

        ride.setFinalFare(
                ride.getEstimatedFare()
        );

        Ride savedRide =
                rideRepository.save(ride);

        broadcastRideUpdate(savedRide);

        return savedRide;
    }


    // =====================================================
    // CANCEL RIDE
    // =====================================================

    public Ride cancelRide(
            String rideId,
            String customerId
    ) {

        Ride ride =
                getCustomerRide(
                        rideId,
                        customerId
                );

        if (
                ride.getStatus()
                        == RideStatus.COMPLETED
        ) {

            throw new RuntimeException(
                    "Completed ride cannot be cancelled"
            );
        }

        if (
                ride.getStatus()
                        == RideStatus.CANCELLED
        ) {

            throw new RuntimeException(
                    "Ride is already cancelled"
            );
        }

        ride.setStatus(
                RideStatus.CANCELLED
        );

        Ride savedRide =
                rideRepository.save(ride);

        broadcastRideUpdate(savedRide);

        return savedRide;
    }


    // =====================================================
    // GET DRIVER LOCATION
    // =====================================================

    public DriverLocationResponse getDriverLocation(
            String rideId,
            String customerId
    ) {

        Ride ride =
                getCustomerRide(
                        rideId,
                        customerId
                );

        if (
                ride.getDriverId() == null
        ) {

            throw new RuntimeException(
                    "No driver assigned to this ride"
            );
        }

        if (
                ride.getStatus()
                        != RideStatus.ACCEPTED

                        &&

                ride.getStatus()
                        != RideStatus.DRIVER_ARRIVING

                        &&

                ride.getStatus()
                        != RideStatus.STARTED
        ) {

            throw new RuntimeException(
                    "Driver location is not available"
            );
        }

        Driver driver =
                driverRepository
                        .findById(
                                ride.getDriverId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Driver not found"
                                )
                        );

        if (
                driver.getCurrentLocation() == null
        ) {

            throw new RuntimeException(
                    "Driver location is not available"
            );
        }

        DriverLocationResponse response =
                new DriverLocationResponse();

        response.setDriverId(
                driver.getId()
        );

        response.setLocation(
                driver.getCurrentLocation()
        );

        response.setRating(
                driver.getRating()
        );

        return response;
    }

    // =====================================================
// DELETE CUSTOMER RIDE FROM HISTORY
// =====================================================

public void deleteCustomerRide(
        String rideId,
        String customerId
) {

    Ride ride =
            rideRepository
                    .findById(rideId)
                    .orElseThrow(
                            () -> new RuntimeException(
                                    "Ride not found"
                            )
                    );


    // ==========================================
    // SECURITY CHECK
    // ==========================================

    if (
            ride.getCustomerId() == null
                    ||
            !ride.getCustomerId()
                    .equals(customerId)
    ) {

        throw new RuntimeException(
                "You are not allowed to delete this ride"
        );

    }


    // ==========================================
    // ONLY HISTORY CAN BE DELETED
    // ==========================================

    if (
            ride.getStatus()
                    != RideStatus.COMPLETED
                    &&
            ride.getStatus()
                    != RideStatus.CANCELLED
    ) {

        throw new RuntimeException(
                "Only completed or cancelled rides can be deleted"
        );

    }


    // ==========================================
    // DELETE
    // ==========================================

    rideRepository.delete(ride);

}
    

    // =====================================================
    // PRIVATE HELPER
    // =====================================================

    private Ride getDriverRide(
            String rideId,
            String driverUserId
    ) {

        Ride ride =
                rideRepository
                        .findById(rideId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Ride not found"
                                )
                        );

        Driver driver =
                driverRepository
                        .findByUserId(driverUserId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Driver profile not found"
                                )
                        );

        if (
                ride.getDriverId() == null
                        ||
                !ride.getDriverId()
                        .equals(driver.getId())
        ) {

            throw new RuntimeException(
                    "This ride does not belong to this driver"
            );
        }

        return ride;
    }
}

