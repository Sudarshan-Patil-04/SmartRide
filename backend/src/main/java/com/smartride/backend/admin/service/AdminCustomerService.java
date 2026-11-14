package com.smartride.backend.admin.service;

import com.smartride.backend.admin.dto.AdminCustomerResponse;
import com.smartride.backend.user.model.Role;
import com.smartride.backend.user.model.User;
import com.smartride.backend.user.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminCustomerService {

    private final UserRepository userRepository;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public AdminCustomerService(
            UserRepository userRepository
    ) {

        this.userRepository =
                userRepository;
    }


    // ==========================================
    // GET ALL CUSTOMERS
    // ==========================================

    public List<AdminCustomerResponse> getAllCustomers() {

        return userRepository
                .findByRole(Role.CUSTOMER)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // ==========================================
    // GET CUSTOMER BY ID
    // ==========================================

    public AdminCustomerResponse getCustomerById(
            String customerId
    ) {

        User customer =
                userRepository
                        .findById(customerId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Customer not found"
                                )
                        );


        // Make sure requested user is actually CUSTOMER

        if (customer.getRole() != Role.CUSTOMER) {

            throw new RuntimeException(
                    "User is not a customer"
            );
        }


        return convertToResponse(
                customer
        );
    }


    // ==========================================
    // DELETE CUSTOMER
    // ==========================================

    public void deleteCustomer(
            String customerId
    ) {

        User customer =
                userRepository
                        .findById(customerId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Customer not found"
                                )
                        );


        // Prevent deleting ADMIN / DRIVER accidentally

        if (customer.getRole() != Role.CUSTOMER) {

            throw new RuntimeException(
                    "User is not a customer"
            );
        }


        userRepository.deleteById(
                customerId
        );
    }


    // ==========================================
    // USER → ADMIN CUSTOMER RESPONSE
    // ==========================================

    private AdminCustomerResponse convertToResponse(
            User user
    ) {

        return new AdminCustomerResponse(

                user.getId(),

                user.getName(),

                user.getEmail(),

                user.getPhone()

        );
    }
}