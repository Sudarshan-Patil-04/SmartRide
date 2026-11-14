package com.smartride.backend.rating.service;

import com.smartride.backend.driver.model.Driver;
import com.smartride.backend.driver.repository.DriverRepository;

import com.smartride.backend.rating.dto.CreateRatingRequest;
import com.smartride.backend.rating.model.Rating;
import com.smartride.backend.rating.repository.RatingRepository;

import com.smartride.backend.ride.model.Ride;
import com.smartride.backend.ride.model.RideStatus;
import com.smartride.backend.ride.repository.RideRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;

    private final RideRepository rideRepository;

    private final DriverRepository driverRepository;


    public RatingService(
            RatingRepository ratingRepository,
            RideRepository rideRepository,
            DriverRepository driverRepository
    ) {

        this.ratingRepository =
                ratingRepository;

        this.rideRepository =
                rideRepository;

        this.driverRepository =
                driverRepository;
    }


    // =====================================================
    // CREATE RATING
    // =====================================================

    public Rating createRating(
            CreateRatingRequest request,
            String userId
    ) {

        // -----------------------------------------------
        // FIND RIDE
        // -----------------------------------------------

        Ride ride =
                rideRepository
                        .findById(request.getRideId())
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Ride not found"
                                )
                        );


        // -----------------------------------------------
        // RIDE MUST BE COMPLETED
        // -----------------------------------------------

        if (
                ride.getStatus()
                        != RideStatus.COMPLETED
        ) {

            throw new RuntimeException(
                    "Only completed rides can be rated"
            );
        }


        // -----------------------------------------------
        // DRIVER MUST EXIST
        // -----------------------------------------------

        if (
                ride.getDriverId() == null
        ) {

            throw new RuntimeException(
                    "No driver assigned to this ride"
            );
        }


        // -----------------------------------------------
        // VALIDATE RATING
        // -----------------------------------------------

        if (
                request.getRating() < 1
                        ||
                request.getRating() > 5
        ) {

            throw new RuntimeException(
                    "Rating must be between 1 and 5"
            );
        }


        // -----------------------------------------------
        // FIND DRIVER
        // -----------------------------------------------

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


        // -----------------------------------------------
        // DETERMINE WHO IS RATING
        // -----------------------------------------------

        boolean isCustomer =
                userId.equals(
                        ride.getCustomerId()
                );


        boolean isDriver =
                driver.getUserId() != null
                        &&
                driver.getUserId().equals(userId);


        // -----------------------------------------------
        // USER MUST BELONG TO RIDE
        // -----------------------------------------------

        if (
                !isCustomer
                        &&
                !isDriver
        ) {

            throw new RuntimeException(
                    "You are not part of this ride"
            );
        }


        // -----------------------------------------------
        // PREVENT DUPLICATE RATING
        // -----------------------------------------------

        if (
                ratingRepository
                        .findByRideIdAndRatedBy(
                                request.getRideId(),
                                userId
                        )
                        .isPresent()
        ) {

            throw new RuntimeException(
                    "You have already rated this ride"
            );
        }


        // -----------------------------------------------
        // CREATE RATING
        // -----------------------------------------------

        Rating rating =
                new Rating();


        rating.setRideId(
                ride.getId()
        );


        rating.setCustomerId(
                ride.getCustomerId()
        );


        rating.setDriverId(
                ride.getDriverId()
        );


        rating.setRatedBy(
                userId
        );


        // -----------------------------------------------
        // DETERMINE RATED USER
        // -----------------------------------------------

        if (isCustomer) {

            // Customer -> Driver

            rating.setRatedUserId(
                    ride.getDriverId()
            );

        } else {

            // Driver -> Customer

            rating.setRatedUserId(
                    ride.getCustomerId()
            );
        }


        rating.setRating(
                request.getRating()
        );


        rating.setComment(
                request.getComment()
        );


        rating.setCreatedAt(
                LocalDateTime.now()
        );


        // -----------------------------------------------
        // SAVE RATING
        // -----------------------------------------------

        Rating savedRating =
                ratingRepository.save(
                        rating
                );


        // -----------------------------------------------
        // UPDATE DRIVER RATING
        // -----------------------------------------------

        if (isCustomer) {

            updateDriverRating(
                    ride.getDriverId()
            );
        }


        return savedRating;
    }


    // =====================================================
    // UPDATE DRIVER RATING
    // =====================================================

    private void updateDriverRating(
            String driverId
    ) {

        /*
         * IMPORTANT:
         *
         * Driver ka average sirf
         * Customer -> Driver ratings
         * se calculate hoga.
         *
         * Driver -> Customer ratings
         * average me include nahi honge.
         */

        List<Rating> ratings =
                ratingRepository
                        .findByDriverIdAndRatedUserId(
                                driverId,
                                driverId
                        );


        if (ratings.isEmpty()) {

            return;
        }


        double total =
                ratings.stream()
                        .mapToInt(
                                Rating::getRating
                        )
                        .sum();


        double average =
                total / ratings.size();


        Driver driver =
                driverRepository
                        .findById(
                                driverId
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Driver not found"
                                )
                        );


        // Round to 1 decimal place
        double roundedRating =
                Math.round(
                        average * 10.0
                ) / 10.0;


        driver.setRating(
                roundedRating
        );


        driverRepository.save(
                driver
        );
    }


    // =====================================================
    // GET DRIVER RATINGS
    // =====================================================

    public List<Rating> getDriverRatings(
            String driverId
    ) {

        /*
         * Only Customer -> Driver reviews
         * should be displayed in:
         *
         * "16 Ratings & Reviews"
         */

        return ratingRepository
                .findByDriverIdAndRatedUserId(
                        driverId,
                        driverId
                );
    }


    // =====================================================
    // GET CUSTOMER RATINGS
    // =====================================================

    public List<Rating> getCustomerRatings(
            String customerId
    ) {

        return ratingRepository
                .findByCustomerId(
                        customerId
                );
    }
}