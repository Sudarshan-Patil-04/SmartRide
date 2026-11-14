package com.smartride.backend.payment.repository;

import com.smartride.backend.payment.model.Payment;
import com.smartride.backend.payment.model.PaymentStatus;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PaymentRepository
        extends MongoRepository<Payment, String> {

    Optional<Payment> findByRideId(
            String rideId
    );

    Optional<Payment> findByRazorpayOrderId(
            String razorpayOrderId
    );

    boolean existsByRideIdAndStatus(
            String rideId,
            PaymentStatus status
    );
}