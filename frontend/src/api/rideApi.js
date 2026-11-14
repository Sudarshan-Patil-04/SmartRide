import {
    apiRequest
} from "./apiClient";


// ==========================================
// CREATE RIDE
// ==========================================

export async function createRide(
    rideData
) {

    return apiRequest(
        "/api/customer/rides",
        {
            method: "POST",

            body: JSON.stringify(
                rideData
            )
        }
    );

}


// ==========================================
// GET ALL CUSTOMER RIDES
// ==========================================

export async function getCustomerRides() {

    return apiRequest(
        "/api/customer/rides",
        {
            method: "GET"
        }
    );

}


// ==========================================
// GET SINGLE RIDE
// ==========================================

export async function getCustomerRide(
    rideId
) {

    return apiRequest(
        `/api/customer/rides/${rideId}`,
        {
            method: "GET"
        }
    );

}


// ==========================================
// CANCEL RIDE
// ==========================================

export async function cancelRide(
    rideId
) {

    return apiRequest(
        `/api/customer/rides/${rideId}/cancel`,
        {
            method: "PUT"
        }
    );

}


// ==========================================
// DELETE CUSTOMER RIDE
// ==========================================

export async function deleteCustomerRide(
    rideId
) {

    return apiRequest(
        `/api/customer/rides/${rideId}`,
        {
            method: "DELETE"
        }
    );

}


// ==========================================
// FIND NEARBY DRIVERS
// ==========================================

export async function findNearbyDrivers(
    rideId
) {

    return apiRequest(
        `/api/customer/rides/${rideId}/nearby-drivers`,
        {
            method: "GET"
        }
    );

}


// ==========================================
// DRIVER LOCATION
// ==========================================

export async function getDriverLocation(
    rideId
) {

    return apiRequest(
        `/api/customer/rides/${rideId}/driver-location`,
        {
            method: "GET"
        }
    );

}