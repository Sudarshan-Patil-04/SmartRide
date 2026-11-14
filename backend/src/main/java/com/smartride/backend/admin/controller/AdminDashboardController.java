package com.smartride.backend.admin.controller;

import com.smartride.backend.admin.dto.AdminDashboardResponse;
import com.smartride.backend.admin.service.AdminDashboardService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(
            AdminDashboardService adminDashboardService
    ) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/stats")
    public AdminDashboardResponse getDashboardStats() {

        return adminDashboardService.getDashboardStats();
    }
}