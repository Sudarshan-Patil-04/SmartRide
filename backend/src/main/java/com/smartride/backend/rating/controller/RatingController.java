package com.smartride.backend.rating.controller;

import com.smartride.backend.rating.dto.CreateRatingRequest;
import com.smartride.backend.rating.dto.RatingResponse;
import com.smartride.backend.rating.model.Rating;
import com.smartride.backend.rating.service.RatingService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;


    public RatingController(
            RatingService ratingService
    ) {

        this.ratingService =
                ratingService;
    }


    // =====================================================
    // CREATE RATING
    // =====================================================

    @PostMapping
    public ResponseEntity<RatingResponse> createRating(

            @RequestBody
            CreateRatingRequest request,

            Authentication authentication

    ) {

        String userId =
                authentication.getName();


        Rating rating =
                ratingService.createRating(
                        request,
                        userId
                );


        return ResponseEntity.ok(
                new RatingResponse(
                        rating
                )
        );
    }


    // =====================================================
    // GET DRIVER RATINGS
    // =====================================================

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Rating>> getDriverRatings(

            @PathVariable
            String driverId

    ) {

        return ResponseEntity.ok(
                ratingService.getDriverRatings(
                        driverId
                )
        );
    }


    // =====================================================
    // GET CUSTOMER RATINGS
    // =====================================================

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Rating>> getCustomerRatings(

            @PathVariable
            String customerId

    ) {

        return ResponseEntity.ok(
                ratingService.getCustomerRatings(
                        customerId
                )
        );
    }
}