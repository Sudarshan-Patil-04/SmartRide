import {
    apiRequest
} from "./apiClient";


// ==========================================
// CREATE RATING
// ==========================================

export const createRating = async (
    rideId,
    rating,
    comment
) => {

    return apiRequest(
        "/api/ratings",
        {
            method: "POST",

            body: JSON.stringify({

                rideId,
                rating,
                comment

            })
        }
    );

};


// ==========================================
// GET DRIVER RATINGS
// ==========================================

export const getDriverRatings = async (
    driverId
) => {

    return apiRequest(
        `/api/ratings/driver/${driverId}`,
        {
            method: "GET"
        }
    );

};


// ==========================================
// GET CUSTOMER RATINGS
// ==========================================

export const getCustomerRatings = async (
    customerId
) => {

    return apiRequest(
        `/api/ratings/customer/${customerId}`,
        {
            method: "GET"
        }
    );

};