package com.smartride.backend.admin.service;

import com.smartride.backend.admin.dto.AdminDriverResponse;
import com.smartride.backend.driver.model.Driver;
import com.smartride.backend.driver.repository.DriverRepository;
import com.smartride.backend.user.model.User;
import com.smartride.backend.user.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminDriverService {

    private final DriverRepository driverRepository;

    private final UserRepository userRepository;


    public AdminDriverService(
            DriverRepository driverRepository,
            UserRepository userRepository
    ) {

        this.driverRepository = driverRepository;

        this.userRepository = userRepository;
    }


    // ==========================================
    // GET ALL DRIVERS
    // ==========================================

    public List<AdminDriverResponse> getAllDrivers() {

        return driverRepository
                .findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // ==========================================
    // GET PENDING DRIVERS
    // ==========================================

    public List<AdminDriverResponse> getPendingDrivers() {

        return driverRepository
                .findByVerificationStatus("PENDING")
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // ==========================================
    // GET DRIVER BY ID
    // ==========================================

    public AdminDriverResponse getDriverById(
            String driverId
    ) {

        Driver driver =
                driverRepository
                        .findById(driverId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Driver not found"
                                )
                        );

        return convertToResponse(driver);
    }


    // ==========================================
    // VERIFY DRIVER
    // ==========================================

    public AdminDriverResponse verifyDriver(
            String driverId
    ) {

        Driver driver =
                driverRepository
                        .findById(driverId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Driver not found"
                                )
                        );

        driver.setVerified(true);

        driver.setOnline(false);

        driver.setVerificationStatus(
                "VERIFIED"
        );

        Driver savedDriver =
                driverRepository.save(driver);

        return convertToResponse(savedDriver);
    }


    // ==========================================
    // REJECT DRIVER
    // ==========================================

    public AdminDriverResponse rejectDriver(
            String driverId
    ) {

        Driver driver =
                driverRepository
                        .findById(driverId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Driver not found"
                                )
                        );

        driver.setVerified(false);

        driver.setOnline(false);

        driver.setVerificationStatus(
                "REJECTED"
        );

        Driver savedDriver =
                driverRepository.save(driver);

        return convertToResponse(savedDriver);
    }


    // ==========================================
    // DELETE DRIVER
    // ==========================================

    public void deleteDriver(
            String driverId
    ) {

        Driver driver =
                driverRepository
                        .findById(driverId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Driver not found"
                                )
                        );


        // Driver collection se delete

        driverRepository.deleteById(
                driverId
        );


        // Related User bhi delete

        if (driver.getUserId() != null) {

            userRepository.deleteById(
                    driver.getUserId()
            );
        }
    }


    // ==========================================
    // DRIVER → ADMIN RESPONSE
    // ==========================================

    private AdminDriverResponse convertToResponse(
            Driver driver
    ) {

        User user =
                userRepository
                        .findById(driver.getUserId())
                        .orElse(null);


        String name =
                user != null
                        ? user.getName()
                        : "N/A";


        String email =
                user != null
                        ? user.getEmail()
                        : "N/A";


        String phone =
                user != null
                        ? user.getPhone()
                        : "N/A";


        String status =
                driver.getVerificationStatus();


        if (
                status == null ||
                status.isBlank()
        ) {

            status =
                    driver.isVerified()
                            ? "VERIFIED"
                            : "PENDING";
        }


        return new AdminDriverResponse(

                driver.getId(),

                name,

                email,

                phone,

                status,

                driver.isOnline()

        );
    }
}