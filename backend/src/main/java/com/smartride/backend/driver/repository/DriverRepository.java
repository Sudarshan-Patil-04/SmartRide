package com.smartride.backend.driver.repository;

import com.smartride.backend.driver.model.Driver;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface DriverRepository
        extends MongoRepository<Driver, String> {


    // ==========================================
    // FIND DRIVER BY USER ID
    // ==========================================

    Optional<Driver> findByUserId(
            String userId
    );


    // ==========================================
    // ONLINE DRIVERS
    // ==========================================

    List<Driver> findByOnlineTrue();


    // ==========================================
    // UNVERIFIED DRIVERS
    // ==========================================

    List<Driver> findByVerifiedFalse();


    // ==========================================
    // VERIFIED DRIVERS
    // ==========================================

    List<Driver> findByVerifiedTrue();


    // ==========================================
    // FIND BY VERIFICATION STATUS
    // ==========================================

    List<Driver> findByVerificationStatus(
            String verificationStatus
    );

}