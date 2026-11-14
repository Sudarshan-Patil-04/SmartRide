const API_URL = "http://localhost:8080/api/customer";


// ==========================================
// GET MY RIDES
// ==========================================

export async function getMyRides() {

    const token =
        localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login first");
    }

    const response =
        await fetch(
            `${API_URL}/rides`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


    const text =
        await response.text();


    let data = {};

    if (text) {

        try {
            data = JSON.parse(text);
        } catch {
            data = {
                message: text
            };
        }

    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Unable to load rides"
        );

    }


    return data;
}


// ==========================================
// GET SINGLE RIDE
// ==========================================

export async function getRide(rideId) {

    const token =
        localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login first");
    }


    const response =
        await fetch(
            `${API_URL}/rides/${rideId}`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


    const text =
        await response.text();


    let data = {};

    if (text) {

        try {
            data = JSON.parse(text);
        } catch {
            data = {
                message: text
            };
        }

    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Unable to load ride"
        );

    }


    return data;
}


// ==========================================
// CREATE RIDE
// ==========================================

export async function createRide(rideData) {

    const token =
        localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login first");
    }


    const response =
        await fetch(
            `${API_URL}/rides`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(rideData)
            }
        );


    const text =
        await response.text();


    let data = {};

    if (text) {

        try {
            data = JSON.parse(text);
        } catch {
            data = {
                message: text
            };
        }

    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Unable to create ride"
        );

    }


    return data;
}