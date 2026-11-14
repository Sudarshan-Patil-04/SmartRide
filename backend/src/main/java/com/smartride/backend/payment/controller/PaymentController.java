package com.smartride.backend.payment.controller;

import com.smartride.backend.payment.dto.CreatePaymentOrderRequest;
import com.smartride.backend.payment.dto.VerifyPaymentRequest;
import com.smartride.backend.payment.model.Payment;
import com.smartride.backend.payment.service.PaymentService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;


    public PaymentController(
            PaymentService paymentService
    ) {

        this.paymentService =
                paymentService;
    }


    // ==========================================
    // CREATE ORDER
    // ==========================================

    @PostMapping("/create-order")
    public Payment createOrder(

            @RequestBody
            CreatePaymentOrderRequest request,

            Authentication authentication

    ) throws Exception {

        String customerId =
                authentication.getName();


        return paymentService.createOrder(

                request.getRideId(),

                customerId
        );
    }


    // ==========================================
    // VERIFY PAYMENT
    // ==========================================

    @PostMapping("/verify")
    public Payment verifyPayment(

            @RequestBody
            VerifyPaymentRequest request,

            Authentication authentication

    ) throws Exception {

        String customerId =
                authentication.getName();


        return paymentService.verifyPayment(

                request,

                customerId
        );
    }
}