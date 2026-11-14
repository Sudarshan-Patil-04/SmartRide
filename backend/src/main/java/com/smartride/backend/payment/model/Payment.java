package com.smartride.backend.payment.model;

import lombok.Data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "payments")
public class Payment {

    @Id
    private String id;

    private String rideId;

    private String customerId;

    private double amount;

    private String currency;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;

    private PaymentStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime paidAt;
}