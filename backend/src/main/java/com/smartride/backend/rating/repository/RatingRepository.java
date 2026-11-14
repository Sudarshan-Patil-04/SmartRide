package com.smartride.backend.rating.repository;

import com.smartride.backend.rating.model.Rating;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository
        extends MongoRepository<Rating, String> {

    // Check whether this user has already rated this ride
    Optional<Rating> findByRideIdAndRatedBy(
            String rideId,
            String ratedBy
    );

    // All ratings received by a driver
    // Customer -> Driver ratings only
    List<Rating> findByDriverIdAndRatedUserId(
            String driverId,
            String ratedUserId
    );

    // All ratings related to a customer
    List<Rating> findByCustomerId(
            String customerId
    );
}