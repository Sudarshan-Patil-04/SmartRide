package com.smartride.backend.payment.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import com.smartride.backend.payment.dto.VerifyPaymentRequest;
import com.smartride.backend.payment.model.Payment;
import com.smartride.backend.payment.model.PaymentStatus;
import com.smartride.backend.payment.repository.PaymentRepository;

import com.smartride.backend.ride.model.Ride;
import com.smartride.backend.ride.model.RideStatus;
import com.smartride.backend.ride.repository.RideRepository;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    private final RideRepository rideRepository;

    private final boolean mockPayment;

    private final RazorpayClient razorpayClient;

    private final String keySecret;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public PaymentService(

            PaymentRepository paymentRepository,

            RideRepository rideRepository,

            @Value("${payment.mock:true}")
            boolean mockPayment,

            @Value("${razorpay.key.id:mock_key_id}")
            String keyId,

            @Value("${razorpay.key.secret:mock_key_secret}")
            String keySecret

    ) throws Exception {

        this.paymentRepository =
                paymentRepository;

        this.rideRepository =
                rideRepository;

        this.mockPayment =
                mockPayment;

        this.keySecret =
                keySecret;


        // ======================================
        // RAZORPAY CLIENT
        // ======================================

        if (!mockPayment) {

            this.razorpayClient =
                    new RazorpayClient(
                            keyId,
                            keySecret
                    );

        } else {

            this.razorpayClient =
                    null;
        }
    }


    // ==========================================
    // CREATE PAYMENT ORDER
    // ==========================================

    public Payment createOrder(

            String rideId,

            String customerId

    ) throws Exception {


        // --------------------------------------
        // FIND RIDE
        // --------------------------------------

        Ride ride =
                rideRepository
                        .findById(rideId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Ride not found"
                                )
                        );


        // --------------------------------------
        // CUSTOMER OWNERSHIP
        // --------------------------------------

        if (
                !ride.getCustomerId()
                        .equals(customerId)
        ) {

            throw new RuntimeException(
                    "You cannot pay for this ride"
            );
        }


        // --------------------------------------
        // RIDE MUST BE COMPLETED
        // --------------------------------------

        if (
                ride.getStatus()
                        != RideStatus.COMPLETED
        ) {

            throw new RuntimeException(
                    "Ride is not completed yet"
            );
        }


        // --------------------------------------
        // CHECK ALREADY PAID
        // --------------------------------------

        if (
                paymentRepository
                        .existsByRideIdAndStatus(
                                rideId,
                                PaymentStatus.SUCCESS
                        )
        ) {

            throw new RuntimeException(
                    "Ride is already paid"
            );
        }


        // --------------------------------------
        // FINAL FARE
        // --------------------------------------

        double finalFare =
                ride.getFinalFare();


        if (finalFare <= 0) {

            throw new RuntimeException(
                    "Invalid ride fare"
            );
        }


        // ======================================
        // MOCK PAYMENT
        // ======================================

        if (mockPayment) {

            return createMockPayment(
                    rideId,
                    customerId,
                    finalFare
            );
        }


        // ======================================
        // REAL RAZORPAY PAYMENT
        // ======================================

        long amount =
                Math.round(
                        finalFare * 100
                );


        JSONObject options =
                new JSONObject();


        options.put(
                "amount",
                amount
        );


        options.put(
                "currency",
                "INR"
        );


        options.put(
                "receipt",
                "ride_" + rideId
        );


        Order order =
                razorpayClient
                        .orders
                        .create(options);


        Payment payment =
                new Payment();


        payment.setRideId(
                rideId
        );


        payment.setCustomerId(
                customerId
        );


        payment.setAmount(
                finalFare
        );


        payment.setCurrency(
                "INR"
        );


        payment.setRazorpayOrderId(
                order.get("id")
        );


        payment.setStatus(
                PaymentStatus.CREATED
        );


        payment.setCreatedAt(
                LocalDateTime.now()
        );


        return paymentRepository.save(
                payment
        );
    }


    // ==========================================
    // CREATE MOCK PAYMENT
    // ==========================================

    private Payment createMockPayment(

            String rideId,

            String customerId,

            double amount

    ) {

        Payment payment =
                new Payment();


        payment.setRideId(
                rideId
        );


        payment.setCustomerId(
                customerId
        );


        payment.setAmount(
                amount
        );


        payment.setCurrency(
                "INR"
        );


        payment.setRazorpayOrderId(
                "mock_order_"
                        + UUID.randomUUID()
        );


        payment.setStatus(
                PaymentStatus.CREATED
        );


        payment.setCreatedAt(
                LocalDateTime.now()
        );


        return paymentRepository.save(
                payment
        );
    }


    // ==========================================
    // VERIFY PAYMENT
    // ==========================================

    public Payment verifyPayment(

            VerifyPaymentRequest request,

            String customerId

    ) throws Exception {


        // --------------------------------------
        // FIND PAYMENT
        // --------------------------------------

        Payment payment =
                paymentRepository
                        .findByRazorpayOrderId(
                                request
                                        .getRazorpayOrderId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Payment order not found"
                                )
                        );


        // --------------------------------------
        // CUSTOMER CHECK
        // --------------------------------------

        if (
                !payment
                        .getCustomerId()
                        .equals(customerId)
        ) {

            throw new RuntimeException(
                    "Invalid customer"
            );
        }


        // ======================================
        // MOCK PAYMENT
        // ======================================

        if (mockPayment) {

            return verifyMockPayment(
                    payment,
                    request
            );
        }


        // ======================================
        // REAL RAZORPAY VERIFICATION
        // ======================================

        String payload =

                request
                        .getRazorpayOrderId()

                + "|"

                + request
                        .getRazorpayPaymentId();


        boolean valid =

                com.razorpay.Utils
                        .verifySignature(

                                payload,

                                request
                                        .getRazorpaySignature(),

                                keySecret
                        );


        if (!valid) {

            payment.setStatus(
                    PaymentStatus.FAILED
            );


            paymentRepository.save(
                    payment
            );


            throw new RuntimeException(
                    "Invalid payment signature"
            );
        }


        payment.setRazorpayPaymentId(
                request
                        .getRazorpayPaymentId()
        );


        payment.setRazorpaySignature(
                request
                        .getRazorpaySignature()
        );


        payment.setStatus(
                PaymentStatus.SUCCESS
        );


        payment.setPaidAt(
                LocalDateTime.now()
        );


        return paymentRepository.save(
                payment
        );
    }


    // ==========================================
    // VERIFY MOCK PAYMENT
    // ==========================================

    private Payment verifyMockPayment(

            Payment payment,

            VerifyPaymentRequest request

    ) {


        // --------------------------------------
        // CHECK MOCK PAYMENT ID
        // --------------------------------------

        if (
                request
                        .getRazorpayPaymentId()
                        == null

                ||

                request
                        .getRazorpayPaymentId()
                        .isBlank()
        ) {

            payment.setStatus(
                    PaymentStatus.FAILED
            );


            paymentRepository.save(
                    payment
            );


            throw new RuntimeException(
                    "Invalid mock payment"
            );
        }


        // --------------------------------------
        // SAVE MOCK PAYMENT
        // --------------------------------------

        payment.setRazorpayPaymentId(

                request
                        .getRazorpayPaymentId()
        );


        payment.setRazorpaySignature(

                "mock_signature"
        );


        payment.setStatus(
                PaymentStatus.SUCCESS
        );


        payment.setPaidAt(
                LocalDateTime.now()
        );


        return paymentRepository.save(
                payment
        );
    }
}