package com.smartride.backend.admin.service;

import com.smartride.backend.admin.dto.AdminDashboardResponse;
import com.smartride.backend.driver.repository.DriverRepository;
import com.smartride.backend.user.model.Role;
import com.smartride.backend.user.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;

    private final DriverRepository driverRepository;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public AdminDashboardService(
            UserRepository userRepository,
            DriverRepository driverRepository
    ) {

        this.userRepository =
                userRepository;

        this.driverRepository =
                driverRepository;
    }


    // ==========================================
    // GET DASHBOARD STATS
    // ==========================================

    public AdminDashboardResponse getDashboardStats() {


        // ==========================================
        // CUSTOMERS
        // ==========================================

        long totalCustomers =
                userRepository
                        .findByRole(Role.CUSTOMER)
                        .size();


        // ==========================================
        // DRIVERS
        // ==========================================

        long totalDrivers =
                driverRepository
                        .count();


        // ==========================================
        // PENDING DRIVERS
        // ==========================================

        long pendingDrivers =
                driverRepository
                        .findByVerificationStatus(
                                "PENDING"
                        )
                        .size();


        // ==========================================
        // VERIFIED DRIVERS
        // ==========================================

        long verifiedDrivers =
                driverRepository
                        .findByVerificationStatus(
                                "VERIFIED"
                        )
                        .size();


        // ==========================================
        // TOTAL RIDES
        // ==========================================

        long totalRides = 0;


        // ==========================================
        // RESPONSE
        // ==========================================

        return new AdminDashboardResponse(

                totalCustomers,

                totalDrivers,

                pendingDrivers,

                verifiedDrivers,

                totalRides

        );
    }
}