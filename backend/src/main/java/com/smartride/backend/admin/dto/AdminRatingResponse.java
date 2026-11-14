package com.smartride.backend.admin.dto;

public class AdminRatingResponse {

    private String id;

    private String customerName;

    private String userName;

    private String comment;

    private double rating;

    private String createdAt;


    // ==========================================
    // DEFAULT CONSTRUCTOR
    // ==========================================

    public AdminRatingResponse() {
    }


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public AdminRatingResponse(
            String id,
            String customerName,
            String userName,
            String comment,
            double rating,
            String createdAt
    ) {

        this.id = id;

        this.customerName = customerName;

        this.userName = userName;

        this.comment = comment;

        this.rating = rating;

        this.createdAt = createdAt;
    }


    // ==========================================
    // GETTERS / SETTERS
    // ==========================================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }


    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }


    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }


    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }


    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}