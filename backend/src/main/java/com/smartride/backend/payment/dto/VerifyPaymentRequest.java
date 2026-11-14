package com.smartride.backend.payment.dto;

import lombok.Data;

@Data
public class VerifyPaymentRequest {

    private String rideId;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;
}