package com.smartride.backend.driver.model;

import lombok.Data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "drivers")
public class Driver {

    @Id
    private String id;

    private String userId;

    // =====================================================
    // DRIVER INFORMATION
    // =====================================================

    private String licenseNumber;

    private String vehicleNumber;

    private String vehicleType;

    // =====================================================
    // DRIVER STATUS
    // =====================================================

    private boolean verified;

    private boolean online;

    // =====================================================
    // DRIVER STATISTICS
    // =====================================================

    private double rating;

    private int totalRides;

    // =====================================================
    // CURRENT LOCATION
    // =====================================================

    private Location currentLocation;

    // =====================================================
    // VERIFICATION STATUS
    //
    // NOT_SUBMITTED
    // PENDING
    // VERIFIED
    // REJECTED
    // =====================================================

    private String verificationStatus;
}