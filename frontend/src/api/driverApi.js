import axios from "axios";

// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL = "http://localhost:8080/api";


// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({
    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json"
    }
});


// =====================================================
// JWT TOKEN
// =====================================================

api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("accessToken") ||
            localStorage.getItem("jwt");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    },

    (error) => {

        return Promise.reject(error);

    }
);


// =====================================================
// GET DRIVER PROFILE
// =====================================================

export async function getDriverProfile() {

    try {

        const response =
            await api.get(
                "/driver/profile"
            );

        return response.data;

    }
    catch (error) {

        console.error(
            "Get driver profile error:",
            error
        );

        const message =
            error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            "Failed to load driver profile.";

        throw new Error(message);

    }

}


// =====================================================
// SUBMIT DRIVER VERIFICATION
// =====================================================
// Driver fills:
// 1. License Number
// 2. Vehicle Number
// 3. Vehicle Type
//
// After submit:
// Driver profile is created
// verificationStatus = PENDING
// Admin can verify it
// =====================================================

export async function submitDriverVerification(
    licenseNumber,
    vehicleNumber,
    vehicleType
) {

    try {

        const response =
            await api.post(
                "/driver/register",
                {
                    licenseNumber:
                        licenseNumber.trim(),

                    vehicleNumber:
                        vehicleNumber.trim(),

                    vehicleType:
                        vehicleType
                }
            );

        return response.data;

    }
    catch (error) {

        console.error(
            "Driver verification submission error:",
            error
        );

        const message =
            error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            "Unable to submit driver verification.";

        throw new Error(message);

    }

}


// =====================================================
// REGISTER DRIVER
// =====================================================
// Alias kept for compatibility with existing code.
// =====================================================

export async function registerDriver(
    licenseNumber,
    vehicleNumber,
    vehicleType
) {

    return submitDriverVerification(
        licenseNumber,
        vehicleNumber,
        vehicleType
    );

}


// =====================================================
// GO ONLINE
// =====================================================

export async function goOnline() {

    try {

        const response =
            await api.put(
                "/driver/online"
            );

        return response.data;

    }
    catch (error) {

        console.error(
            "Go online error:",
            error
        );

        const message =
            error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            "Unable to go online.";

        throw new Error(message);

    }

}


// =====================================================
// GO OFFLINE
// =====================================================

export async function goOffline() {

    try {

        const response =
            await api.put(
                "/driver/offline"
            );

        return response.data;

    }
    catch (error) {

        console.error(
            "Go offline error:",
            error
        );

        const message =
            error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            "Unable to go offline.";

        throw new Error(message);

    }

}


// =====================================================
// UPDATE DRIVER LOCATION
// =====================================================

export async function updateDriverLocation(
    latitude,
    longitude
) {

    try {

        const response =
            await api.put(
                "/driver/location",
                {
                    latitude: latitude,
                    longitude: longitude
                }
            );

        return response.data;

    }
    catch (error) {

        console.error(
            "Update driver location error:",
            error
        );

        const message =
            error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            "Unable to update driver location.";

        throw new Error(message);

    }

}


// =====================================================
// GET ONLINE DRIVERS
// =====================================================

export async function getOnlineDrivers() {

    try {

        const response =
            await api.get(
                "/driver/online"
            );

        return response.data;

    }
    catch (error) {

        console.error(
            "Get online drivers error:",
            error
        );

        const message =
            error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            "Unable to get online drivers.";

        throw new Error(message);

    }

}


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default api;