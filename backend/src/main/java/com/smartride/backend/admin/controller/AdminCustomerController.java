package com.smartride.backend.admin.controller;

import com.smartride.backend.admin.dto.AdminCustomerResponse;
import com.smartride.backend.admin.service.AdminCustomerService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/customers")
public class AdminCustomerController {

    private final AdminCustomerService adminCustomerService;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public AdminCustomerController(
            AdminCustomerService adminCustomerService
    ) {

        this.adminCustomerService =
                adminCustomerService;
    }


    // ==========================================
    // GET ALL CUSTOMERS
    // ==========================================

    @GetMapping
    public List<AdminCustomerResponse> getAllCustomers() {

        return adminCustomerService
                .getAllCustomers();
    }


    // ==========================================
    // GET CUSTOMER BY ID
    // ==========================================

    @GetMapping("/{customerId}")
    public AdminCustomerResponse getCustomerById(
            @PathVariable String customerId
    ) {

        return adminCustomerService
                .getCustomerById(
                        customerId
                );
    }


    // ==========================================
    // DELETE CUSTOMER
    // ==========================================

    @DeleteMapping("/{customerId}")
    public void deleteCustomer(
            @PathVariable String customerId
    ) {

        adminCustomerService
                .deleteCustomer(
                        customerId
                );
    }
}