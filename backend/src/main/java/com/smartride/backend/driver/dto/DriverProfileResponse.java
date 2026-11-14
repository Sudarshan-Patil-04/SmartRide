package com.smartride.backend.driver.dto;

import lombok.Data;

@Data
public class DriverProfileResponse {

    // ==========================================
    // USER INFORMATION
    // ==========================================

    private String name;

    private String email;

    private String phone;


    // ==========================================
    // DRIVER INFORMATION
    // ==========================================

    private String licenseNumber;

    private String vehicleNumber;

    private String vehicleType;


    // ==========================================
    // DRIVER STATUS
    // ==========================================

    private boolean verified;

    private boolean online;


    // ==========================================
    // DRIVER STATISTICS
    // ==========================================

    private double rating;

    private int totalRides;


    // ==========================================
    // VERIFICATION STATUS
    // ==========================================

    private String verificationStatus;


    // ==========================================
    // CURRENT LOCATION
    // ==========================================

    private LocationResponse currentLocation;

}