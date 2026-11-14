package com.smartride.backend.admin.service;

import com.smartride.backend.admin.dto.AdminRatingResponse;
import com.smartride.backend.rating.model.Rating;
import com.smartride.backend.rating.repository.RatingRepository;
import com.smartride.backend.user.model.User;
import com.smartride.backend.user.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminRatingsService {

    private final RatingRepository ratingRepository;

    private final UserRepository userRepository;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public AdminRatingsService(
            RatingRepository ratingRepository,
            UserRepository userRepository
    ) {

        this.ratingRepository =
                ratingRepository;

        this.userRepository =
                userRepository;
    }


    // ==========================================
    // GET ALL RATINGS
    // ==========================================

    public List<AdminRatingResponse> getAllRatings() {

        return ratingRepository
                .findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // ==========================================
    // RATING → ADMIN RESPONSE
    // ==========================================

    private AdminRatingResponse convertToResponse(
            Rating rating
    ) {

        User customer =
                userRepository
                        .findById(
                                rating.getCustomerId()
                        )
                        .orElse(null);


        String customerName =
                customer != null
                        ? customer.getName()
                        : "Customer";


        String userName =
                customer != null
                        ? customer.getName()
                        : "Customer";


        String createdAt =
                rating.getCreatedAt() != null
                        ? rating.getCreatedAt().toString()
                        : null;


        return new AdminRatingResponse(

                rating.getId(),

                customerName,

                userName,

                rating.getComment(),

                rating.getRating(),

                createdAt
        );
    }
}