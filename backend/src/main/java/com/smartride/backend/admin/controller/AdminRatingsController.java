package com.smartride.backend.admin.controller;

import com.smartride.backend.admin.dto.AdminRatingResponse;
import com.smartride.backend.admin.service.AdminRatingsService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/ratings")
public class AdminRatingsController {

    private final AdminRatingsService adminRatingsService;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public AdminRatingsController(
            AdminRatingsService adminRatingsService
    ) {

        this.adminRatingsService =
                adminRatingsService;
    }


    // ==========================================
    // GET ALL RATINGS
    // ==========================================

    @GetMapping
    public List<AdminRatingResponse> getAllRatings() {

        return adminRatingsService
                .getAllRatings();
    }
}