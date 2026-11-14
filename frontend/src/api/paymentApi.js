import {
    apiRequest
} from "./apiClient";


// ==========================================
// CREATE PAYMENT ORDER
// ==========================================

export async function createPaymentOrder(
    rideId
) {

    return apiRequest(
        "/api/payments/create-order",
        {
            method: "POST",

            body: JSON.stringify({

                rideId: rideId

            })
        }
    );

}


// ==========================================
// VERIFY PAYMENT
// ==========================================

export async function verifyPayment(
    paymentData
) {

    return apiRequest(
        "/api/payments/verify",
        {
            method: "POST",

            body: JSON.stringify(
                paymentData
            )
        }
    );

}