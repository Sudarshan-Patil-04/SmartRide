package com.smartride.backend.driver.dto;

import lombok.Data;

@Data
public class DriverVerificationRequest {

    private String licenseNumber;

    private String vehicleNumber;

    private String vehicleType;

}