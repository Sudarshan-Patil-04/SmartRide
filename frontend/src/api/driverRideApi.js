const API_URL =
    "http://localhost:8080/api/driver/rides";


// ==========================================
// COMMON RESPONSE HANDLER
// ==========================================

async function handleResponse(response) {

    const text =
        await response.text();

    let data = null;

    if (text) {

        try {
            data = JSON.parse(text);
        }
        catch {
            data = text;
        }

    }

    console.log(
        "API Status:",
        response.status
    );

    console.log(
        "API Response:",
        data
    );


    if (!response.ok) {

        let message =
            `Request failed with status ${response.status}`;

        if (
            typeof data === "object" &&
            data !== null
        ) {

            message =
                data?.message ||
                data?.error ||
                message;

        }
        else if (
            typeof data === "string" &&
            data.length > 0
        ) {

            message = data;

        }

        throw new Error(message);

    }

    return data;

}


// ==========================================
// AUTH HEADER
// ==========================================

function getHeaders(token) {

    return {

        Authorization:
            `Bearer ${token}`,

        "Content-Type":
            "application/json"

    };

}


// ==========================================
// GET AVAILABLE RIDES
// ==========================================

export const getAvailableRides =
    async (token) => {

        const response =
            await fetch(
                `${API_URL}/available`,
                {
                    method: "GET",
                    headers: getHeaders(token)
                }
            );

        return handleResponse(response);

    };


// ==========================================
// ACCEPT RIDE
// ==========================================

export const acceptRide =
    async (rideId, token) => {

        const response =
            await fetch(
                `${API_URL}/${rideId}/accept`,
                {
                    method: "PUT",
                    headers: getHeaders(token)
                }
            );

        return handleResponse(response);

    };


// ==========================================
// DRIVER ARRIVING
// ==========================================

export const driverArriving =
    async (rideId, token) => {

        const response =
            await fetch(
                `${API_URL}/${rideId}/arriving`,
                {
                    method: "PUT",
                    headers: getHeaders(token)
                }
            );

        return handleResponse(response);

    };


// ==========================================
// START RIDE
// ==========================================

export const startRide =
    async (rideId, token) => {

        const response =
            await fetch(
                `${API_URL}/${rideId}/start`,
                {
                    method: "PUT",
                    headers: getHeaders(token)
                }
            );

        return handleResponse(response);

    };


// ==========================================
// COMPLETE RIDE
// ==========================================

export const completeRide =
    async (rideId, token) => {

        const response =
            await fetch(
                `${API_URL}/${rideId}/complete`,
                {
                    method: "PUT",
                    headers: getHeaders(token)
                }
            );

        return handleResponse(response);

    };


// ==========================================
// CANCEL RIDE
// ==========================================

export const cancelRide =
    async (rideId, token) => {

        const response =
            await fetch(
                `${API_URL}/${rideId}/cancel`,
                {
                    method: "PUT",
                    headers: getHeaders(token)
                }
            );

        return handleResponse(response);

    };


// ==========================================
// GET CURRENT RIDE
// ==========================================

export const getCurrentRide =
    async (token) => {

        const response =
            await fetch(
                `${API_URL}/current`,
                {
                    method: "GET",
                    headers: getHeaders(token)
                }
            );


        // No active ride

        if (
            response.status === 404 ||
            response.status === 204
        ) {

            return null;

        }

        return handleResponse(response);

    };


// ==========================================
// GET RIDE HISTORY
// ==========================================

export const getRideHistory =
    async (token) => {

        const response =
            await fetch(
                `${API_URL}/history`,
                {
                    method: "GET",
                    headers: getHeaders(token)
                }
            );

        return handleResponse(response);

    };