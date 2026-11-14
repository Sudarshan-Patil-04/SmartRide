package com.smartride.backend.driver.service;

import com.smartride.backend.driver.dto.DriverProfileResponse;
import com.smartride.backend.driver.dto.DriverRegistrationRequest;
import com.smartride.backend.driver.dto.DriverVerificationRequest;
import com.smartride.backend.driver.dto.LocationRequest;
import com.smartride.backend.driver.model.Driver;
import com.smartride.backend.driver.model.Location;
import com.smartride.backend.driver.repository.DriverRepository;
import com.smartride.backend.user.model.User;
import com.smartride.backend.user.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverService {

    private final DriverRepository driverRepository;
    private final UserRepository userRepository;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DriverService(
            DriverRepository driverRepository,
            UserRepository userRepository
    ) {

        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
    }


    // =====================================================
    // GET DRIVER PROFILE
    // =====================================================

    public DriverProfileResponse getDriverProfile(
            String userId
    ) {

        // -------------------------------------------------
        // GET USER
        // -------------------------------------------------

        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        // -------------------------------------------------
        // GET DRIVER
        // -------------------------------------------------

        Driver driver =
                driverRepository
                        .findByUserId(userId)
                        .orElse(null);


        // -------------------------------------------------
        // CREATE RESPONSE
        // -------------------------------------------------

        DriverProfileResponse response =
                new DriverProfileResponse();


        // =================================================
        // USER INFORMATION
        // =================================================

        response.setName(
                user.getName()
        );

        response.setEmail(
                user.getEmail()
        );

        response.setPhone(
                user.getPhone()
        );


        // =================================================
        // DRIVER PROFILE DOES NOT EXIST YET
        // =================================================

        if (driver == null) {

            response.setLicenseNumber(
                    null
            );

            response.setVehicleNumber(
                    null
            );

            response.setVehicleType(
                    null
            );

            response.setVerified(
                    false
            );

            response.setOnline(
                    false
            );

            response.setVerificationStatus(
                    "NOT_SUBMITTED"
            );

            response.setRating(
                    5.0
            );

            response.setTotalRides(
                    0
            );

            return response;
        }


        // =================================================
        // DRIVER INFORMATION
        // =================================================

        response.setLicenseNumber(
                driver.getLicenseNumber()
        );

        response.setVehicleNumber(
                driver.getVehicleNumber()
        );

        response.setVehicleType(
                driver.getVehicleType()
        );


        // =================================================
        // STATUS
        // =================================================

        response.setVerified(
                driver.isVerified()
        );

        response.setOnline(
                driver.isOnline()
        );

        response.setVerificationStatus(
                driver.getVerificationStatus()
        );


        // =================================================
        // STATISTICS
        // =================================================

        response.setRating(
                driver.getRating()
        );

        response.setTotalRides(
                driver.getTotalRides()
        );


        return response;
    }


    // =====================================================
    // REGISTER DRIVER
    //
    // This method is now used for the Verify Driver form.
    //
    // Driver submits:
    // 1. License Number
    // 2. Vehicle Number
    // 3. Vehicle Type
    //
    // Result:
    // verificationStatus = PENDING
    // verified = false
    // =====================================================

    public Driver registerDriver(
            String userId,
            DriverRegistrationRequest request
    ) {

        // =================================================
        // CHECK USER
        // =================================================

        userRepository
                .findById(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );


        // =================================================
        // VALIDATE REQUEST
        // =================================================

        if (request == null) {

            throw new RuntimeException(
                    "Driver verification information is required"
            );
        }


        // =================================================
        // LICENSE NUMBER
        // =================================================

        if (
                request.getLicenseNumber() == null ||
                request.getLicenseNumber()
                        .trim()
                        .isEmpty()
        ) {

            throw new RuntimeException(
                    "License number is required"
            );
        }


        // =================================================
        // VEHICLE NUMBER
        // =================================================

        if (
                request.getVehicleNumber() == null ||
                request.getVehicleNumber()
                        .trim()
                        .isEmpty()
        ) {

            throw new RuntimeException(
                    "Vehicle number is required"
            );
        }


        // =================================================
        // VEHICLE TYPE
        // =================================================

        if (
                request.getVehicleType() == null ||
                request.getVehicleType()
                        .trim()
                        .isEmpty()
        ) {

            throw new RuntimeException(
                    "Vehicle type is required"
            );
        }


        // =================================================
        // CHECK EXISTING DRIVER
        // =================================================

        Driver driver =
                driverRepository
                        .findByUserId(userId)
                        .orElse(null);


        // =================================================
        // CREATE DRIVER IF NOT EXISTS
        // =================================================

        if (driver == null) {

            driver = new Driver();

            driver.setUserId(
                    userId
            );

            driver.setRating(
                    5.0
            );

            driver.setTotalRides(
                    0
            );

            driver.setOnline(
                    false
            );
        }


        // =================================================
        // SAVE VEHICLE INFORMATION
        // =================================================

        driver.setLicenseNumber(
                request.getLicenseNumber()
                        .trim()
        );

        driver.setVehicleNumber(
                request.getVehicleNumber()
                        .trim()
        );

        driver.setVehicleType(
                request.getVehicleType()
                        .trim()
        );


        // =================================================
        // VERIFICATION STATUS
        // =================================================

        driver.setVerified(
                false
        );

        driver.setOnline(
                false
        );

        driver.setVerificationStatus(
                "PENDING"
        );


        // =================================================
        // SAVE
        // =================================================

        return driverRepository.save(
                driver
        );
    }


    // =====================================================
    // SUBMIT DRIVER VERIFICATION
    //
    // Kept for compatibility if some existing code uses it.
    //
    // =====================================================

    public Driver submitDriverVerification(
            String userId,
            DriverVerificationRequest request
    ) {

        if (request == null) {

            throw new RuntimeException(
                    "Driver verification information is required"
            );
        }


        // -------------------------------------------------
        // FIND DRIVER
        // -------------------------------------------------

        Driver driver =
                driverRepository
                        .findByUserId(userId)
                        .orElse(null);


        // -------------------------------------------------
        // CREATE DRIVER IF NOT EXISTS
        // -------------------------------------------------

        if (driver == null) {

            userRepository
                    .findById(userId)
                    .orElseThrow(
                            () -> new RuntimeException(
                                    "User not found"
                            )
                    );

            driver = new Driver();

            driver.setUserId(
                    userId
            );

            driver.setRating(
                    5.0
            );

            driver.setTotalRides(
                    0
            );

            driver.setOnline(
                    false
            );
        }


        // =================================================
        // ALREADY VERIFIED
        // =================================================

        if (driver.isVerified()) {

            throw new RuntimeException(
                    "Driver is already verified"
            );
        }


        // =================================================
        // VALIDATE LICENSE
        // =================================================

        if (
                request.getLicenseNumber() == null ||
                request.getLicenseNumber()
                        .trim()
                        .isEmpty()
        ) {

            throw new RuntimeException(
                    "License number is required"
            );
        }


        // =================================================
        // VALIDATE VEHICLE NUMBER
        // =================================================

        if (
                request.getVehicleNumber() == null ||
                request.getVehicleNumber()
                        .trim()
                        .isEmpty()
        ) {

            throw new RuntimeException(
                    "Vehicle number is required"
            );
        }


        // =================================================
        // VALIDATE VEHICLE TYPE
        // =================================================

        if (
                request.getVehicleType() == null ||
                request.getVehicleType()
                        .trim()
                        .isEmpty()
        ) {

            throw new RuntimeException(
                    "Vehicle type is required"
            );
        }


        // =================================================
        // SAVE INFORMATION
        // =================================================

        driver.setLicenseNumber(
                request.getLicenseNumber()
                        .trim()
        );

        driver.setVehicleNumber(
                request.getVehicleNumber()
                        .trim()
        );

        driver.setVehicleType(
                request.getVehicleType()
                        .trim()
        );


        // =================================================
        // SEND TO ADMIN
        // =================================================

        driver.setVerified(
                false
        );

        driver.setOnline(
                false
        );

        driver.setVerificationStatus(
                "PENDING"
        );


        return driverRepository.save(
                driver
        );
    }


    // =====================================================
    // GO ONLINE
    // =====================================================

    public Driver goOnline(
            String userId
    ) {

        Driver driver =
                getDriver(userId);


        if (!driver.isVerified()) {

            throw new RuntimeException(
                    "Driver is not verified by admin"
            );
        }


        driver.setOnline(
                true
        );


        return driverRepository.save(
                driver
        );
    }


    // =====================================================
    // GO OFFLINE
    // =====================================================

    public Driver goOffline(
            String userId
    ) {

        Driver driver =
                getDriver(userId);


        driver.setOnline(
                false
        );


        return driverRepository.save(
                driver
        );
    }


    // =====================================================
    // UPDATE LOCATION
    // =====================================================

    public Driver updateLocation(
            String userId,
            LocationRequest request
    ) {

        Driver driver =
                getDriver(userId);


        // -------------------------------------------------
        // DRIVER MUST BE ONLINE
        // -------------------------------------------------

        if (!driver.isOnline()) {

            throw new RuntimeException(
                    "Driver is offline"
            );
        }


        // -------------------------------------------------
        // REQUEST VALIDATION
        // -------------------------------------------------

        if (request == null) {

            throw new RuntimeException(
                    "Location is required"
            );
        }


        // -------------------------------------------------
        // LATITUDE
        // -------------------------------------------------

        if (
                request.getLatitude() < -90 ||
                request.getLatitude() > 90
        ) {

            throw new RuntimeException(
                    "Invalid latitude"
            );
        }


        // -------------------------------------------------
        // LONGITUDE
        // -------------------------------------------------

        if (
                request.getLongitude() < -180 ||
                request.getLongitude() > 180
        ) {

            throw new RuntimeException(
                    "Invalid longitude"
            );
        }


        // -------------------------------------------------
        // CREATE LOCATION
        // -------------------------------------------------

        Location location =
                new Location();


        location.setLatitude(
                request.getLatitude()
        );

        location.setLongitude(
                request.getLongitude()
        );


        driver.setCurrentLocation(
                location
        );


        return driverRepository.save(
                driver
        );
    }


    // =====================================================
    // GET ONLINE DRIVERS
    // =====================================================

    public List<Driver> getOnlineDrivers() {

        return driverRepository
                .findByOnlineTrue();
    }


    // =====================================================
    // INTERNAL GET DRIVER
    // =====================================================

    private Driver getDriver(
            String userId
    ) {

        return driverRepository
                .findByUserId(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Driver profile not found"
                        )
                );
    }
}