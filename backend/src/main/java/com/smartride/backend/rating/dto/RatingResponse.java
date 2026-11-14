package com.smartride.backend.rating.dto;

import com.smartride.backend.rating.model.Rating;

import java.time.LocalDateTime;

public class RatingResponse {

    private String id;

    private String rideId;

    private String ratedBy;

    private String ratedUserId;

    private int rating;

    private String comment;

    private LocalDateTime createdAt;


    public RatingResponse(Rating rating) {

        this.id =
                rating.getId();

        this.rideId =
                rating.getRideId();

        this.ratedBy =
                rating.getRatedBy();

        this.ratedUserId =
                rating.getRatedUserId();

        this.rating =
                rating.getRating();

        this.comment =
                rating.getComment();

        this.createdAt =
                rating.getCreatedAt();
    }


    public String getId() {
        return id;
    }

    public String getRideId() {
        return rideId;
    }

    public String getRatedBy() {
        return ratedBy;
    }

    public String getRatedUserId() {
        return ratedUserId;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}